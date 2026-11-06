create table public.erp_employees (
  access_scope text not null check (access_scope in ('sandbox', 'production')),
  emp_no text not null check (length(pg_catalog.btrim(emp_no)) > 0),
  last_name text not null check (length(pg_catalog.btrim(last_name)) > 0),
  first_name text not null check (length(pg_catalog.btrim(first_name)) > 0),
  gender text not null check (gender in ('M', 'F', 'O')),
  birth_date date not null,
  hire_date date not null,
  sep_date date,
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, emp_no),
  check (hire_date >= birth_date),
  check (sep_date is null or sep_date >= hire_date)
);

create unique index erp_employees_scope_emp_no_ci_idx
  on public.erp_employees (access_scope, pg_catalog.lower(emp_no));

create table public.erp_jobs (
  access_scope text not null check (access_scope in ('sandbox', 'production')),
  job_code text not null check (length(pg_catalog.btrim(job_code)) > 0),
  job_desc text not null check (length(pg_catalog.btrim(job_desc)) > 0),
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, job_code)
);

create unique index erp_jobs_scope_job_code_ci_idx
  on public.erp_jobs (access_scope, pg_catalog.lower(job_code));

create table public.erp_departments (
  access_scope text not null check (access_scope in ('sandbox', 'production')),
  dept_code text not null check (length(pg_catalog.btrim(dept_code)) > 0),
  dept_name text not null check (length(pg_catalog.btrim(dept_name)) > 0),
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, dept_code)
);

create unique index erp_departments_scope_dept_code_ci_idx
  on public.erp_departments (access_scope, pg_catalog.lower(dept_code));

create table public.erp_job_histories (
  access_scope text not null check (access_scope in ('sandbox', 'production')),
  id uuid not null default pg_catalog.gen_random_uuid(),
  emp_no text not null,
  job_code text not null,
  eff_date date not null,
  salary numeric(12, 2) not null check (salary >= 0),
  dept_code text not null,
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, id),
  foreign key (access_scope, emp_no)
    references public.erp_employees (access_scope, emp_no)
    on update cascade on delete restrict,
  foreign key (access_scope, job_code)
    references public.erp_jobs (access_scope, job_code)
    on update cascade on delete restrict,
  foreign key (access_scope, dept_code)
    references public.erp_departments (access_scope, dept_code)
    on update cascade on delete restrict
);

create unique index erp_job_histories_scope_active_identity_idx
  on public.erp_job_histories (access_scope, emp_no, job_code, eff_date)
  where not is_deleted;

create index erp_job_histories_scope_employee_date_idx
  on public.erp_job_histories (access_scope, emp_no, eff_date desc)
  where not is_deleted;

create table public.erp_sales (
  access_scope text not null check (access_scope in ('sandbox', 'production')),
  trans_no text not null check (length(pg_catalog.btrim(trans_no)) > 0),
  sales_date date not null,
  cust_no text not null,
  emp_no text not null,
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, trans_no),
  foreign key (access_scope, cust_no)
    references public.erp_customers (access_scope, cust_no)
    on update cascade on delete restrict,
  foreign key (access_scope, emp_no)
    references public.erp_employees (access_scope, emp_no)
    on update cascade on delete restrict
);

create unique index erp_sales_scope_trans_no_ci_idx
  on public.erp_sales (access_scope, pg_catalog.lower(trans_no));

create index erp_sales_scope_date_idx
  on public.erp_sales (access_scope, sales_date desc)
  where not is_deleted;

create table public.erp_sales_details (
  access_scope text not null check (access_scope in ('sandbox', 'production')),
  id uuid not null default pg_catalog.gen_random_uuid(),
  trans_no text not null,
  prod_code text not null,
  quantity integer not null check (quantity > 0),
  is_deleted boolean not null default false,
  stamp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (access_scope, id),
  foreign key (access_scope, trans_no)
    references public.erp_sales (access_scope, trans_no)
    on update cascade on delete restrict,
  foreign key (access_scope, prod_code)
    references public.erp_products (access_scope, prod_code)
    on update cascade on delete restrict
);

create unique index erp_sales_details_scope_active_identity_idx
  on public.erp_sales_details (access_scope, trans_no, prod_code)
  where not is_deleted;

create index erp_sales_details_scope_product_idx
  on public.erp_sales_details (access_scope, prod_code)
  where not is_deleted;

create function public.enforce_hr_sales_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor public.profiles%rowtype;
  old_row jsonb;
  new_row jsonb;
  field_name text;
  has_edit boolean := false;
begin
  select * into actor
  from public.profiles
  where id = (select auth.uid())
    and account_status = 'active';

  if not found or actor.access_scope <> new.access_scope then
    raise exception 'An active account in the matching data scope is required.';
  end if;

  if tg_op = 'UPDATE' then
    old_row := pg_catalog.to_jsonb(old);
    new_row := pg_catalog.to_jsonb(new);
    if old.access_scope is distinct from new.access_scope then
      raise exception 'Data scope cannot be changed.';
    end if;
    foreach field_name in array pg_catalog.string_to_array(tg_argv[3], ',') loop
      if old_row -> field_name is distinct from new_row -> field_name then
        raise exception 'Record identity cannot be changed.';
      end if;
    end loop;
    new.updated_at := pg_catalog.now();
  end if;

  if actor.role in ('admin', 'superadmin') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.has_erp_permission(new.access_scope, tg_argv[0]) then
      raise exception 'You do not have permission to add this record.';
    end if;
    return new;
  end if;

  if old.is_deleted is distinct from new.is_deleted then
    if new.is_deleted then
      if not public.has_erp_permission(new.access_scope, tg_argv[2]) then
        raise exception 'You do not have permission to delete this record.';
      end if;
    else
      raise exception 'Only an administrator can restore records.';
    end if;
  end if;

  foreach field_name in array pg_catalog.string_to_array(tg_argv[4], ',') loop
    if old_row -> field_name is distinct from new_row -> field_name then
      has_edit := true;
      exit;
    end if;
  end loop;
  if has_edit and not public.has_erp_permission(new.access_scope, tg_argv[1]) then
    raise exception 'You do not have permission to edit this record.';
  end if;

  return new;
end;
$$;

create trigger erp_employees_enforce_write
  before insert or update on public.erp_employees
  for each row execute function public.enforce_hr_sales_write(
    'hr.empAdd', 'hr.empEdit', 'hr.empDelete', 'emp_no', 'last_name,first_name,gender,birth_date,hire_date,sep_date'
  );
create trigger erp_jobs_enforce_write
  before insert or update on public.erp_jobs
  for each row execute function public.enforce_hr_sales_write(
    'hr.jobAdd', 'hr.jobEdit', 'hr.jobDelete', 'job_code', 'job_desc'
  );
create trigger erp_departments_enforce_write
  before insert or update on public.erp_departments
  for each row execute function public.enforce_hr_sales_write(
    'hr.deptAdd', 'hr.deptEdit', 'hr.deptDelete', 'dept_code', 'dept_name'
  );
create trigger erp_job_histories_enforce_write
  before insert or update on public.erp_job_histories
  for each row execute function public.enforce_hr_sales_write(
    'hr.jhAdd', 'hr.jhEdit', 'hr.jhDelete', 'id', 'emp_no,job_code,eff_date,salary,dept_code'
  );
create trigger erp_sales_enforce_write
  before insert or update on public.erp_sales
  for each row execute function public.enforce_hr_sales_write(
    'sales.add', 'sales.edit', 'sales.delete', 'trans_no', 'sales_date,cust_no,emp_no'
  );
create trigger erp_sales_details_enforce_write
  before insert or update on public.erp_sales_details
  for each row execute function public.enforce_hr_sales_write(
    'sales.detailAdd', 'sales.detailEdit', 'sales.detailDelete', 'id', 'trans_no,prod_code,quantity'
  );

revoke execute on function public.enforce_hr_sales_write() from public, anon, authenticated;

alter table public.erp_employees enable row level security;
alter table public.erp_jobs enable row level security;
alter table public.erp_departments enable row level security;
alter table public.erp_job_histories enable row level security;
alter table public.erp_sales enable row level security;
alter table public.erp_sales_details enable row level security;

create policy "Scoped users can read employees"
  on public.erp_employees for select to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'hr.view'))
    or (select public.has_erp_permission(access_scope, 'hr.jhView'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (
        (select public.has_erp_permission(access_scope, 'reports.activeEmployees'))
        or (select public.has_erp_permission(access_scope, 'reports.allEmployees'))
        or (select public.has_erp_permission(access_scope, 'reports.empJobHistory'))
        or (select public.has_erp_permission(access_scope, 'reports.topSales'))
      )
    )
    or (select public.has_erp_permission(access_scope, 'sales.view'))
  );

create policy "Scoped users can add employees"
  on public.erp_employees for insert to authenticated
  with check ((select public.has_erp_permission(access_scope, 'hr.empAdd')));
create policy "Scoped users can update employees"
  on public.erp_employees for update to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'hr.empEdit'))
    or (select public.has_erp_permission(access_scope, 'hr.empDelete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'hr.empEdit'))
    or (select public.has_erp_permission(access_scope, 'hr.empDelete'))
  );

create policy "Scoped users can read jobs"
  on public.erp_jobs for select to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'hr.view'))
    or (select public.has_erp_permission(access_scope, 'hr.jhView'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (
        (select public.has_erp_permission(access_scope, 'reports.activeEmployees'))
        or (select public.has_erp_permission(access_scope, 'reports.allEmployees'))
        or (select public.has_erp_permission(access_scope, 'reports.empJobHistory'))
      )
    )
  );
create policy "Scoped users can add jobs"
  on public.erp_jobs for insert to authenticated
  with check ((select public.has_erp_permission(access_scope, 'hr.jobAdd')));
create policy "Scoped users can update jobs"
  on public.erp_jobs for update to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'hr.jobEdit'))
    or (select public.has_erp_permission(access_scope, 'hr.jobDelete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'hr.jobEdit'))
    or (select public.has_erp_permission(access_scope, 'hr.jobDelete'))
  );

create policy "Scoped users can read departments"
  on public.erp_departments for select to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'hr.view'))
    or (select public.has_erp_permission(access_scope, 'hr.jhView'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (
        (select public.has_erp_permission(access_scope, 'reports.activeEmployees'))
        or (select public.has_erp_permission(access_scope, 'reports.allEmployees'))
        or (select public.has_erp_permission(access_scope, 'reports.empJobHistory'))
      )
    )
  );
create policy "Scoped users can add departments"
  on public.erp_departments for insert to authenticated
  with check ((select public.has_erp_permission(access_scope, 'hr.deptAdd')));
create policy "Scoped users can update departments"
  on public.erp_departments for update to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'hr.deptEdit'))
    or (select public.has_erp_permission(access_scope, 'hr.deptDelete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'hr.deptEdit'))
    or (select public.has_erp_permission(access_scope, 'hr.deptDelete'))
  );

create policy "Scoped users can read job histories"
  on public.erp_job_histories for select to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'hr.view'))
    or (select public.has_erp_permission(access_scope, 'hr.jhView'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (select public.has_erp_permission(access_scope, 'reports.empJobHistory'))
    )
  );
create policy "Scoped users can add job histories"
  on public.erp_job_histories for insert to authenticated
  with check ((select public.has_erp_permission(access_scope, 'hr.jhAdd')));
create policy "Scoped users can update job histories"
  on public.erp_job_histories for update to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'hr.jhEdit'))
    or (select public.has_erp_permission(access_scope, 'hr.jhDelete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'hr.jhEdit'))
    or (select public.has_erp_permission(access_scope, 'hr.jhDelete'))
  );

create policy "Scoped users can read sales"
  on public.erp_sales for select to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'sales.view'))
    or (select public.has_erp_permission(access_scope, 'sales.detailView'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (
        (select public.has_erp_permission(access_scope, 'reports.topCustomers'))
        or (select public.has_erp_permission(access_scope, 'reports.topProducts'))
        or (select public.has_erp_permission(access_scope, 'reports.topSales'))
      )
    )
  );
create policy "Scoped users can add sales"
  on public.erp_sales for insert to authenticated
  with check ((select public.has_erp_permission(access_scope, 'sales.add')));
create policy "Scoped users can update sales"
  on public.erp_sales for update to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'sales.edit'))
    or (select public.has_erp_permission(access_scope, 'sales.delete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'sales.edit'))
    or (select public.has_erp_permission(access_scope, 'sales.delete'))
  );

create policy "Scoped users can read sales details"
  on public.erp_sales_details for select to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'sales.view'))
    or (select public.has_erp_permission(access_scope, 'sales.detailView'))
    or (
      (select public.has_erp_permission(access_scope, 'reports.view'))
      and (
        (select public.has_erp_permission(access_scope, 'reports.topCustomers'))
        or (select public.has_erp_permission(access_scope, 'reports.topProducts'))
        or (select public.has_erp_permission(access_scope, 'reports.topSales'))
      )
    )
  );
create policy "Scoped users can add sales details"
  on public.erp_sales_details for insert to authenticated
  with check ((select public.has_erp_permission(access_scope, 'sales.detailAdd')));
create policy "Scoped users can update sales details"
  on public.erp_sales_details for update to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'sales.detailEdit'))
    or (select public.has_erp_permission(access_scope, 'sales.detailDelete'))
  )
  with check (
    (select public.has_erp_permission(access_scope, 'sales.detailEdit'))
    or (select public.has_erp_permission(access_scope, 'sales.detailDelete'))
  );

create policy "Report users can read product prices for sales reports"
  on public.erp_product_prices for select to authenticated
  using (
    (select public.has_erp_permission(access_scope, 'reports.view'))
    and (
      (select public.has_erp_permission(access_scope, 'reports.topCustomers'))
      or (select public.has_erp_permission(access_scope, 'reports.topProducts'))
      or (select public.has_erp_permission(access_scope, 'reports.topSales'))
    )
  );

revoke all on public.erp_employees, public.erp_jobs, public.erp_departments,
  public.erp_job_histories, public.erp_sales, public.erp_sales_details
  from anon, authenticated;
grant select, insert, update on public.erp_employees, public.erp_jobs,
  public.erp_departments, public.erp_job_histories, public.erp_sales,
  public.erp_sales_details to authenticated;
grant all on public.erp_employees, public.erp_jobs, public.erp_departments,
  public.erp_job_histories, public.erp_sales, public.erp_sales_details to service_role;

create function public.seed_sandbox_hr_sales(
  p_employees jsonb,
  p_jobs jsonb,
  p_departments jsonb,
  p_job_histories jsonb,
  p_sales jsonb,
  p_sales_details jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor public.profiles%rowtype;
  empty_count integer;
begin
  select * into actor
  from public.profiles
  where id = (select auth.uid())
    and account_status = 'active'
    and role in ('admin', 'superadmin')
    and access_scope = 'sandbox'
  for update;

  if not found then
    raise exception 'An active sandbox administrator is required to seed demo HR and Sales data.';
  end if;

  if pg_catalog.jsonb_typeof(p_employees) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_jobs) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_departments) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_job_histories) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_sales) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_sales_details) is distinct from 'array' then
    raise exception 'Valid employee, job, department, history, sale, and detail arrays are required.';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(71922303);

  select
    (select pg_catalog.count(*) from public.erp_employees where access_scope = 'sandbox')
    + (select pg_catalog.count(*) from public.erp_jobs where access_scope = 'sandbox')
    + (select pg_catalog.count(*) from public.erp_departments where access_scope = 'sandbox')
    + (select pg_catalog.count(*) from public.erp_job_histories where access_scope = 'sandbox')
    + (select pg_catalog.count(*) from public.erp_sales where access_scope = 'sandbox')
    + (select pg_catalog.count(*) from public.erp_sales_details where access_scope = 'sandbox')
  into empty_count;

  if empty_count > 0 then
    if exists (select 1 from public.erp_employees where access_scope = 'sandbox')
      and exists (select 1 from public.erp_jobs where access_scope = 'sandbox')
      and exists (select 1 from public.erp_departments where access_scope = 'sandbox')
      and exists (select 1 from public.erp_job_histories where access_scope = 'sandbox')
      and exists (select 1 from public.erp_sales where access_scope = 'sandbox')
      and exists (select 1 from public.erp_sales_details where access_scope = 'sandbox') then
      return;
    end if;
    raise exception 'Sandbox HR or Sales data is partially populated; inspect it before seeding.';
  end if;

  if not exists (select 1 from public.erp_customers where access_scope = 'sandbox')
    or not exists (select 1 from public.erp_products where access_scope = 'sandbox') then
    raise exception 'Seed the sandbox customer and product catalog before HR and Sales demo data.';
  end if;

  insert into public.erp_jobs (access_scope, job_code, job_desc, is_deleted, stamp)
    select 'sandbox', item.job_code, item.job_desc, coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_jobs) as item(
      job_code text, job_desc text, is_deleted boolean, stamp text
    );

  insert into public.erp_departments (access_scope, dept_code, dept_name, is_deleted, stamp)
    select 'sandbox', item.dept_code, item.dept_name, coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_departments) as item(
      dept_code text, dept_name text, is_deleted boolean, stamp text
    );

  insert into public.erp_employees (
    access_scope, emp_no, last_name, first_name, gender, birth_date, hire_date, sep_date, is_deleted, stamp
  )
    select 'sandbox', item.emp_no, item.last_name, item.first_name, item.gender,
      item.birth_date, item.hire_date, nullif(item.sep_date, '')::date,
      coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_employees) as item(
      emp_no text, last_name text, first_name text, gender text, birth_date date,
      hire_date date, sep_date text, is_deleted boolean, stamp text
    );

  insert into public.erp_job_histories (
    access_scope, id, emp_no, job_code, eff_date, salary, dept_code, is_deleted, stamp
  )
    select 'sandbox', coalesce(item.id, pg_catalog.gen_random_uuid()), item.emp_no,
      item.job_code, item.eff_date, item.salary, item.dept_code,
      coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_job_histories) as item(
      id uuid, emp_no text, job_code text, eff_date date, salary numeric,
      dept_code text, is_deleted boolean, stamp text
    );

  insert into public.erp_sales (access_scope, trans_no, sales_date, cust_no, emp_no, is_deleted, stamp)
    select 'sandbox', item.trans_no, item.sales_date, item.cust_no, item.emp_no,
      coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_sales) as item(
      trans_no text, sales_date date, cust_no text, emp_no text, is_deleted boolean, stamp text
    );

  insert into public.erp_sales_details (
    access_scope, id, trans_no, prod_code, quantity, is_deleted, stamp
  )
    select 'sandbox', coalesce(item.id, pg_catalog.gen_random_uuid()), item.trans_no, item.prod_code, item.quantity,
      coalesce(item.is_deleted, false), coalesce(item.stamp, '')
    from pg_catalog.jsonb_to_recordset(p_sales_details) as item(
      id uuid, trans_no text, prod_code text, quantity integer, is_deleted boolean, stamp text
    );
end;
$$;

revoke execute on function public.seed_sandbox_hr_sales(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb)
  from public, anon;
grant execute on function public.seed_sandbox_hr_sales(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb)
  to authenticated;
