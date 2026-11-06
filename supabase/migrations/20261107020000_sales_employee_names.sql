drop policy if exists "Scoped users can read employees" on public.erp_employees;

create policy "Scoped HR and employee-report users can read employees"
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
      )
    )
  );

create function public.get_sales_employee_names()
returns table (
  emp_no text,
  last_name text,
  first_name text,
  is_deleted boolean
)
language plpgsql
stable
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

  if not found or not (
    (select public.has_erp_permission(actor.access_scope, 'sales.view'))
    or (select public.has_erp_permission(actor.access_scope, 'sales.detailView'))
    or (
      (select public.has_erp_permission(actor.access_scope, 'reports.view'))
      and (select public.has_erp_permission(actor.access_scope, 'reports.topSales'))
    )
  ) then
    raise exception 'An active account with Sales or Top Sales report access is required.';
  end if;
  return query
    select employee.emp_no, employee.last_name, employee.first_name, employee.is_deleted
    from public.erp_employees as employee
    where employee.access_scope = actor.access_scope;
end;
$$;

revoke execute on function public.get_sales_employee_names() from public, anon;
grant execute on function public.get_sales_employee_names() to authenticated;

notify pgrst, 'reload schema';
