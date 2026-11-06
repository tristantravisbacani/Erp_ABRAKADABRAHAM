create function public.can_manage_profile(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as actor
    join public.profiles as target on target.id = target_user_id
    where actor.id = (select auth.uid())
      and actor.account_status = 'active'
      and (
        actor.role = 'superadmin'
        or (actor.role = 'admin' and target.role = 'user')
      )
  );
$$;

revoke execute on function public.can_manage_profile(uuid) from public, anon;
grant execute on function public.can_manage_profile(uuid) to authenticated;

create policy "Administrators can read managed profiles"
  on public.profiles
  for select
  to authenticated
  using ((select public.can_manage_profile(id)));

create policy "Administrators can read managed user permissions"
  on public.user_permissions
  for select
  to authenticated
  using ((select public.can_manage_profile(user_id)));

create function public.admin_update_user(
  p_user_id uuid,
  p_first_name text,
  p_last_name text,
  p_role text,
  p_account_status text,
  p_permissions jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor public.profiles%rowtype;
  target public.profiles%rowtype;
  allowed_permissions text[] := array[
    'customers.view',
    'customers.add',
    'customers.edit',
    'customers.delete',
    'products.view',
    'products.add',
    'products.edit',
    'products.delete',
    'products.priceAdd',
    'products.priceEdit',
    'products.priceDelete',
    'hr.view',
    'hr.jobAdd',
    'hr.jobEdit',
    'hr.jobDelete',
    'hr.deptAdd',
    'hr.deptEdit',
    'hr.deptDelete',
    'hr.empAdd',
    'hr.empEdit',
    'hr.empDelete',
    'hr.jhView',
    'hr.jhAdd',
    'hr.jhEdit',
    'hr.jhDelete',
    'sales.view',
    'sales.add',
    'sales.edit',
    'sales.delete',
    'sales.detailView',
    'sales.detailAdd',
    'sales.detailEdit',
    'sales.detailDelete',
    'reports.view',
    'reports.topCustomers',
    'reports.productMaster',
    'reports.topProducts',
    'reports.activeEmployees',
    'reports.allEmployees',
    'reports.empJobHistory',
    'reports.topSales'
  ];
  permission_count integer;
begin
  if (select auth.uid()) is null then
    raise exception 'An authenticated administrator is required.';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(71922301);

  select *
    into actor
    from public.profiles
    where id = (select auth.uid())
    for update;

  if not found or actor.account_status <> 'active'
    or actor.role not in ('admin', 'superadmin') then
    raise exception 'An active administrator is required.';
  end if;

  select *
    into target
    from public.profiles
    where id = p_user_id
    for update;

  if not found then
    raise exception 'The selected account does not exist.';
  end if;

  if actor.role = 'admin' and target.role <> 'user' then
    raise exception 'Admins can manage User accounts only.';
  end if;

  if target.access_scope = 'sandbox' then
    raise exception 'Shared demo accounts are protected from user-management changes.';
  end if;

  if actor.id = target.id
    and (p_role is distinct from target.role
      or p_account_status is distinct from target.account_status) then
    raise exception 'You cannot change your own role or account status.';
  end if;

  if p_role not in ('superadmin', 'admin', 'user') then
    raise exception 'Invalid account role.';
  end if;

  if actor.role = 'admin' and p_role <> 'user' then
    raise exception 'Admins cannot assign administrator roles.';
  end if;

  if p_account_status not in ('pending', 'active', 'blocked', 'disapproved') then
    raise exception 'Invalid account status.';
  end if;

  if p_first_name is null or length(pg_catalog.btrim(p_first_name)) = 0
    or length(pg_catalog.btrim(p_first_name)) > 100
    or p_last_name is null or length(pg_catalog.btrim(p_last_name)) = 0
    or length(pg_catalog.btrim(p_last_name)) > 100 then
    raise exception 'First and last names are required and must be at most 100 characters.';
  end if;

  if p_permissions is null or pg_catalog.jsonb_typeof(p_permissions) <> 'object' then
    raise exception 'A valid permissions object is required.';
  end if;

  select pg_catalog.count(*)
    into permission_count
    from pg_catalog.jsonb_each(p_permissions) as entry(key, value);

  if permission_count <> pg_catalog.cardinality(allowed_permissions)
    or exists (
      select 1
      from pg_catalog.jsonb_each(p_permissions) as entry(key, value)
      where not (entry.key = any (allowed_permissions))
        or pg_catalog.jsonb_typeof(entry.value) <> 'boolean'
    ) then
    raise exception 'The permissions object contains missing or invalid permission keys.';
  end if;

  if target.role = 'superadmin'
    and target.account_status = 'active'
    and (p_role <> 'superadmin' or p_account_status <> 'active')
    and (
      select pg_catalog.count(*)
      from public.profiles
      where role = 'superadmin'
        and account_status = 'active'
    ) <= 1 then
    raise exception 'Cannot demote or deactivate the last active Superadmin.';
  end if;

  update public.profiles
    set first_name = pg_catalog.btrim(p_first_name),
        last_name = pg_catalog.btrim(p_last_name),
        role = p_role,
        account_status = p_account_status
    where id = target.id;

  delete from public.user_permissions
    where user_id = target.id;

  insert into public.user_permissions (user_id, permission, enabled)
    select target.id, entry.key, entry.value::boolean
    from pg_catalog.jsonb_each(p_permissions) as entry(key, value);

  insert into public.audit_log (
    actor_id,
    action,
    resource_table,
    record_id,
    details
  ) values (
    actor.id,
    'user.manage',
    'profiles',
    target.id::text,
    pg_catalog.jsonb_build_object(
      'old_role', target.role,
      'new_role', p_role,
      'old_status', target.account_status,
      'new_status', p_account_status
    )
  );
end;
$$;

revoke execute on function public.admin_update_user(uuid, text, text, text, text, jsonb)
  from public, anon;
grant execute on function public.admin_update_user(uuid, text, text, text, text, jsonb)
  to authenticated;
