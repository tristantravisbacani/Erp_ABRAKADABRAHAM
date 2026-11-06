create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  first_name text not null default '',
  last_name text not null default '',
  role text not null default 'user'
    check (role in ('superadmin', 'admin', 'user')),
  account_status text not null default 'pending'
    check (account_status in ('pending', 'active', 'blocked', 'disapproved')),
  access_scope text not null default 'production'
    check (access_scope in ('sandbox', 'production')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_permissions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  permission text not null check (length(trim(permission)) > 0),
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, permission)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null check (length(trim(action)) > 0),
  resource_table text not null check (length(trim(resource_table)) > 0),
  record_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index user_permissions_enabled_user_idx
  on public.user_permissions (user_id, permission)
  where enabled;

create index audit_log_created_at_idx
  on public.audit_log (created_at desc);

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_permissions enable row level security;
alter table public.audit_log enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can read their own permissions"
  on public.user_permissions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.profiles, public.user_permissions, public.audit_log
  from anon, authenticated;
grant select on public.profiles, public.user_permissions to authenticated;
grant all on public.profiles, public.user_permissions, public.audit_log to service_role;
grant usage, select on sequence public.audit_log_id_seq to service_role;

revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
