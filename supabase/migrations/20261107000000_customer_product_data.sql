create table public.erp_customers (
  access_scope text not null check (access_scope in ('sandbox', 'production')),
  cust_no text not null check (length(pg_catalog.btrim(cust_no)) > 0),
  cust_name text not null check (length(pg_catalog.btrim(cust_name)) > 0),
  address text not null,
  payterms text not null check (length(pg_catalog.btrim(payterms)) > 0),
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, cust_no)
);

create unique index erp_customers_scope_cust_no_ci_idx
  on public.erp_customers (access_scope, pg_catalog.lower(cust_no));

create table public.erp_products (
  access_scope text not null check (access_scope in ('sandbox', 'production')),
  prod_code text not null check (length(pg_catalog.btrim(prod_code)) > 0),
  description text not null check (length(pg_catalog.btrim(description)) > 0),
  unit text not null check (length(pg_catalog.btrim(unit)) > 0),
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, prod_code)
);

create unique index erp_products_scope_prod_code_ci_idx
  on public.erp_products (access_scope, pg_catalog.lower(prod_code));

create table public.erp_product_prices (
  access_scope text not null,
  prod_code text not null,
  eff_date date not null,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, prod_code, eff_date),
  foreign key (access_scope, prod_code)
    references public.erp_products (access_scope, prod_code)
    on update cascade
    on delete restrict
);

create index erp_product_prices_scope_date_idx
  on public.erp_product_prices (access_scope, prod_code, eff_date desc)
  where not is_deleted;

create function public.has_erp_permission(p_access_scope text, p_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as actor
    where actor.id = (select auth.uid())
      and actor.account_status = 'active'
      and actor.access_scope = p_access_scope
      and (
        actor.role in ('admin', 'superadmin')
        or exists (
          select 1
          from public.user_permissions as permission
          where permission.user_id = actor.id
            and permission.permission = p_permission
            and permission.enabled
        )
      )
  );
$$;

revoke execute on function public.has_erp_permission(text, text) from public, anon;
grant execute on function public.has_erp_permission(text, text) to authenticated;

create function public.enforce_erp_customer_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor public.profiles%rowtype;
begin
  select * into actor
  from public.profiles
  where id = (select auth.uid())
    and account_status = 'active';

  if not found or actor.access_scope <> new.access_scope then
    raise exception 'An active account in the matching data scope is required.';
  end if;

  if tg_op = 'UPDATE' then
    if old.access_scope <> new.access_scope or old.cust_no is distinct from new.cust_no then
      raise exception 'Customer identity and data scope cannot be changed.';
    end if;
    new.updated_at := pg_catalog.now();
  end if;

  if actor.role in ('admin', 'superadmin') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.has_erp_permission(new.access_scope, 'customers.add') then
      raise exception 'You do not have permission to add customers.';
    end if;
    return new;
  end if;

  if old.cust_name is distinct from new.cust_name
    or old.address is distinct from new.address
    or old.payterms is distinct from new.payterms then
    if not public.has_erp_permission(new.access_scope, 'customers.edit') then
      raise exception 'You do not have permission to edit customers.';
    end if;
  end if;
  if old.is_deleted is distinct from new.is_deleted then
    if new.is_deleted then
      if not public.has_erp_permission(new.access_scope, 'customers.delete') then
        raise exception 'You do not have permission to delete customers.';
      end if;
    elsif actor.role not in ('admin', 'superadmin') then
      raise exception 'Only an administrator can restore customers.';
    end if;
  end if;

  return new;
end;
$$;

create trigger erp_customers_enforce_write
  before insert or update on public.erp_customers
  for each row execute function public.enforce_erp_customer_write();

create function public.enforce_erp_product_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor public.profiles%rowtype;
begin
  select * into actor
  from public.profiles
  where id = (select auth.uid())
    and account_status = 'active';

  if not found or actor.access_scope <> new.access_scope then
    raise exception 'An active account in the matching data scope is required.';
  end if;

  if tg_op = 'UPDATE' then
    if old.access_scope <> new.access_scope or old.prod_code is distinct from new.prod_code then
      raise exception 'Product identity and data scope cannot be changed.';
    end if;
    new.updated_at := pg_catalog.now();
  end if;

  if actor.role in ('admin', 'superadmin') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.has_erp_permission(new.access_scope, 'products.add') then
      raise exception 'You do not have permission to add products.';
    end if;
    return new;
  end if;

  if old.description is distinct from new.description or old.unit is distinct from new.unit then
    if not public.has_erp_permission(new.access_scope, 'products.edit') then
      raise exception 'You do not have permission to edit products.';
    end if;
  end if;
  if old.is_deleted is distinct from new.is_deleted then
    if new.is_deleted then
      if not public.has_erp_permission(new.access_scope, 'products.delete') then
        raise exception 'You do not have permission to delete products.';
      end if;
    elsif actor.role not in ('admin', 'superadmin') then
      raise exception 'Only an administrator can restore products.';
    end if;
  end if;

  return new;
end;
$$;

create trigger erp_products_enforce_write
  before insert or update on public.erp_products
  for each row execute function public.enforce_erp_product_write();

create function public.enforce_erp_product_price_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor public.profiles%rowtype;
begin
  select * into actor
  from public.profiles
  where id = (select auth.uid())
    and account_status = 'active';

  if not found or actor.access_scope <> new.access_scope then
    raise exception 'An active account in the matching data scope is required.';
  end if;

  if tg_op = 'UPDATE' then
    if old.access_scope <> new.access_scope
      or old.prod_code is distinct from new.prod_code
      or old.eff_date is distinct from new.eff_date then
      raise exception 'Price identity and data scope cannot be changed.';
    end if;
    new.updated_at := pg_catalog.now();
  end if;

  if actor.role in ('admin', 'superadmin') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.has_erp_permission(new.access_scope, 'products.priceAdd') then
      raise exception 'You do not have permission to add prices.';
    end if;
    return new;
  end if;

  if old.unit_price is distinct from new.unit_price then
    if not public.has_erp_permission(new.access_scope, 'products.priceEdit') then
      raise exception 'You do not have permission to edit prices.';
    end if;
  end if;
  if old.is_deleted is distinct from new.is_deleted then
    if new.is_deleted then
      if not public.has_erp_permission(new.access_scope, 'products.priceDelete') then
        raise exception 'You do not have permission to delete prices.';
      end if;
    elsif actor.role not in ('admin', 'superadmin') then
      raise exception 'Only an administrator can restore prices.';
    end if;
  end if;

  return new;
end;
$$;

create trigger erp_product_prices_enforce_write
  before insert or update on public.erp_product_prices
  for each row execute function public.enforce_erp_product_price_write();

revoke execute on function public.enforce_erp_customer_write() from public, anon, authenticated;
revoke execute on function public.enforce_erp_product_write() from public, anon, authenticated;
revoke execute on function public.enforce_erp_product_price_write() from public, anon, authenticated;

alter table public.erp_customers enable row level security;
alter table public.erp_products enable row level security;
alter table public.erp_product_prices enable row level security;

create policy "Scoped users can read customers"
  on public.erp_customers
  for select
  to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'customers.view'))
    or (select public.has_erp_permission(access_scope, 'sales.view'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (
        (select public.has_erp_permission(access_scope, 'reports.topCustomers'))
        or (select public.has_erp_permission(access_scope, 'reports.topSales'))
      )
    )
  );

create policy "Scoped users can add customers"
  on public.erp_customers
  for insert
  to authenticated
  with check ((select public.has_erp_permission(access_scope, 'customers.add')));

create policy "Scoped users can update customers"
  on public.erp_customers
  for update
  to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'customers.edit'))
    or (select public.has_erp_permission(access_scope, 'customers.delete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'customers.edit'))
    or (select public.has_erp_permission(access_scope, 'customers.delete'))
  );

create policy "Scoped users can read products"
  on public.erp_products
  for select
  to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'products.view'))
    or (select public.has_erp_permission(access_scope, 'sales.view'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (
        (select public.has_erp_permission(access_scope, 'reports.productMaster'))
        or (select public.has_erp_permission(access_scope, 'reports.topProducts'))
        or (select public.has_erp_permission(access_scope, 'reports.topSales'))
      )
    )
  );

create policy "Scoped users can add products"
  on public.erp_products
  for insert
  to authenticated
  with check ((select public.has_erp_permission(access_scope, 'products.add')));

create policy "Scoped users can update products"
  on public.erp_products
  for update
  to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'products.edit'))
    or (select public.has_erp_permission(access_scope, 'products.delete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'products.edit'))
    or (select public.has_erp_permission(access_scope, 'products.delete'))
  );

create policy "Scoped users can read product prices"
  on public.erp_product_prices
  for select
  to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'products.view'))
    or (select public.has_erp_permission(access_scope, 'sales.view'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (
        (select public.has_erp_permission(access_scope, 'reports.topProducts'))
        or (select public.has_erp_permission(access_scope, 'reports.topSales'))
      )
    )
  );

create policy "Scoped users can add product prices"
  on public.erp_product_prices
  for insert
  to authenticated
  with check ((select public.has_erp_permission(access_scope, 'products.priceAdd')));

create policy "Scoped users can update product prices"
  on public.erp_product_prices
  for update
  to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'products.priceEdit'))
    or (select public.has_erp_permission(access_scope, 'products.priceDelete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'products.priceEdit'))
    or (select public.has_erp_permission(access_scope, 'products.priceDelete'))
  );

revoke all on public.erp_customers, public.erp_products, public.erp_product_prices
  from anon, authenticated;
grant select, insert, update
  on public.erp_customers, public.erp_products, public.erp_product_prices
  to authenticated;
grant all on public.erp_customers, public.erp_products, public.erp_product_prices to service_role;

create function public.seed_sandbox_catalog(
  p_customers jsonb,
  p_products jsonb,
  p_prices jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor public.profiles%rowtype;
begin
  select * into actor
  from public.profiles
  where id = (select auth.uid())
    and account_status = 'active'
    and role in ('admin', 'superadmin')
    and access_scope = 'sandbox'
  for update;

  if not found then
    raise exception 'An active sandbox administrator is required to seed demo catalog data.';
  end if;

  if pg_catalog.jsonb_typeof(p_customers) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_products) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_prices) is distinct from 'array' then
    raise exception 'Valid customer, product, and price arrays are required.';
  end if;
  if pg_catalog.jsonb_array_length(p_customers) = 0
    or pg_catalog.jsonb_array_length(p_products) = 0
    or pg_catalog.jsonb_array_length(p_prices) = 0 then
    raise exception 'Demo catalog arrays cannot be empty.';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(71922302);

  if exists (select 1 from public.erp_customers where access_scope = 'sandbox')
    and exists (select 1 from public.erp_products where access_scope = 'sandbox')
    and exists (select 1 from public.erp_product_prices where access_scope = 'sandbox') then
    return;
  elsif exists (select 1 from public.erp_customers where access_scope = 'sandbox')
    or exists (select 1 from public.erp_products where access_scope = 'sandbox')
    or exists (select 1 from public.erp_product_prices where access_scope = 'sandbox') then
    raise exception 'Sandbox catalog data is partially populated; inspect it before seeding.';
  end if;

  insert into public.erp_customers (access_scope, cust_no, cust_name, address, payterms, is_deleted, stamp)
    select 'sandbox', item.cust_no, item.cust_name, item.address, item.payterms,
      coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_customers) as item(
      cust_no text, cust_name text, address text, payterms text, is_deleted boolean, stamp text
    );

  insert into public.erp_products (access_scope, prod_code, description, unit, is_deleted, stamp)
    select 'sandbox', item.prod_code, item.description, item.unit,
      coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_products) as item(
      prod_code text, description text, unit text, is_deleted boolean, stamp text
    );

  insert into public.erp_product_prices (access_scope, prod_code, eff_date, unit_price, is_deleted, stamp)
    select 'sandbox', item.prod_code, item.eff_date, item.unit_price,
      coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_prices) as item(
      prod_code text, eff_date date, unit_price numeric, is_deleted boolean, stamp text
    );
end;
$$;

revoke execute on function public.seed_sandbox_catalog(jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.seed_sandbox_catalog(jsonb, jsonb, jsonb) to authenticated;
