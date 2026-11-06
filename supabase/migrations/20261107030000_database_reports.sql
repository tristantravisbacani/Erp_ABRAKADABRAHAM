create function public.get_erp_report(
  p_report_id text,
  p_date_from date default null,
  p_date_to date default null,
  p_top_count integer default 10,
  p_employee_no text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor public.profiles%rowtype;
  required_permission text;
  report_rows jsonb;
  employee_rows jsonb;
begin
  select * into actor
  from public.profiles
  where id = (select auth.uid())
    and account_status = 'active';

  if not found then
    raise exception 'An active account is required to run reports.';
  end if;

  if p_date_from is not null and p_date_to is not null and p_date_from > p_date_to then
    raise exception 'The start date must be on or before the end date.';
  end if;
  if p_top_count is null or p_top_count < 1 or p_top_count > 100 then
    raise exception 'Top N must be between 1 and 100.';
  end if;

  required_permission := case p_report_id
    when 'topCustomers' then 'reports.topCustomers'
    when 'productMaster' then 'reports.productMaster'
    when 'topProducts' then 'reports.topProducts'
    when 'activeEmployees' then 'reports.activeEmployees'
    when 'allEmployees' then 'reports.allEmployees'
    when 'empJobHistory' then 'reports.empJobHistory'
    when 'topSales' then 'reports.topSales'
    else null
  end;

  if required_permission is null
    or not (select public.has_erp_permission(actor.access_scope, 'reports.view'))
    or not (select public.has_erp_permission(actor.access_scope, required_permission)) then
    raise exception 'You do not have permission to run this report.';
  end if;

  if p_report_id = 'productMaster' then
    select coalesce(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'prodCode', product.prod_code,
          'description', product.description,
          'unit', product.unit,
          'unitPrice', price.unit_price
        ) order by product.prod_code
      ),
      '[]'::jsonb
    )
    into report_rows
    from public.erp_products as product
    left join lateral (
      select product_price.unit_price
      from public.erp_product_prices as product_price
      where product_price.access_scope = actor.access_scope
        and product_price.prod_code = product.prod_code
        and not product_price.is_deleted
        and product_price.eff_date <= current_date
      order by product_price.eff_date desc
      limit 1
    ) as price on true
    where product.access_scope = actor.access_scope
      and not product.is_deleted;

    return pg_catalog.jsonb_build_object('rows', report_rows);
  end if;

  if p_report_id = 'topCustomers' then
    with sales_lines as (
      select sale.cust_no,
        detail.quantity * coalesce(price.unit_price, 0) as line_amount
      from public.erp_sales as sale
      join public.erp_sales_details as detail
        on detail.access_scope = sale.access_scope
        and detail.trans_no = sale.trans_no
        and not detail.is_deleted
      left join lateral (
        select product_price.unit_price
        from public.erp_product_prices as product_price
        where product_price.access_scope = actor.access_scope
          and product_price.prod_code = detail.prod_code
          and not product_price.is_deleted
          and product_price.eff_date <= sale.sales_date
        order by product_price.eff_date desc
        limit 1
      ) as price on true
      where sale.access_scope = actor.access_scope
        and not sale.is_deleted
        and (p_date_from is null or sale.sales_date >= p_date_from)
        and (p_date_to is null or sale.sales_date <= p_date_to)
    ),
    totals as (
      select sales_lines.cust_no, pg_catalog.sum(sales_lines.line_amount) as total
      from sales_lines
      group by sales_lines.cust_no
    ),
    ranked as (
      select totals.cust_no, customer.cust_name,
        totals.total,
        pg_catalog.row_number() over (order by totals.total desc, totals.cust_no) as rank
      from totals
      left join public.erp_customers as customer
        on customer.access_scope = actor.access_scope
        and customer.cust_no = totals.cust_no
    )
    select coalesce(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'rank', ranked.rank,
          'custNo', ranked.cust_no,
          'name', coalesce(ranked.cust_name, ranked.cust_no),
          'total', ranked.total
        ) order by ranked.rank
      ),
      '[]'::jsonb
    )
    into report_rows
    from ranked
    where ranked.rank <= p_top_count;

    return pg_catalog.jsonb_build_object('rows', report_rows);
  end if;

  if p_report_id = 'topProducts' then
    with sales_lines as (
      select detail.prod_code, detail.quantity,
        detail.quantity * coalesce(price.unit_price, 0) as line_amount
      from public.erp_sales as sale
      join public.erp_sales_details as detail
        on detail.access_scope = sale.access_scope
        and detail.trans_no = sale.trans_no
        and not detail.is_deleted
      left join lateral (
        select product_price.unit_price
        from public.erp_product_prices as product_price
        where product_price.access_scope = actor.access_scope
          and product_price.prod_code = detail.prod_code
          and not product_price.is_deleted
          and product_price.eff_date <= sale.sales_date
        order by product_price.eff_date desc
        limit 1
      ) as price on true
      where sale.access_scope = actor.access_scope
        and not sale.is_deleted
        and (p_date_from is null or sale.sales_date >= p_date_from)
        and (p_date_to is null or sale.sales_date <= p_date_to)
    ),
    totals as (
      select sales_lines.prod_code,
        pg_catalog.sum(sales_lines.quantity) as quantity,
        pg_catalog.sum(sales_lines.line_amount) as amount
      from sales_lines
      group by sales_lines.prod_code
    ),
    ranked as (
      select totals.prod_code, product.description, totals.quantity, totals.amount,
        pg_catalog.row_number() over (order by totals.amount desc, totals.prod_code) as rank
      from totals
      left join public.erp_products as product
        on product.access_scope = actor.access_scope
        and product.prod_code = totals.prod_code
    )
    select coalesce(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'rank', ranked.rank,
          'prodCode', ranked.prod_code,
          'description', coalesce(ranked.description, ranked.prod_code),
          'quantity', ranked.quantity,
          'amount', ranked.amount
        ) order by ranked.rank
      ),
      '[]'::jsonb
    )
    into report_rows
    from ranked
    where ranked.rank <= p_top_count;

    return pg_catalog.jsonb_build_object('rows', report_rows);
  end if;

  if p_report_id = 'activeEmployees' then
    select coalesce(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'empNo', employee.emp_no,
          'lastName', employee.last_name,
          'firstName', employee.first_name,
          'gender', employee.gender,
          'birthDate', employee.birth_date,
          'hireDate', employee.hire_date
        ) order by employee.emp_no
      ),
      '[]'::jsonb
    )
    into report_rows
    from public.erp_employees as employee
    where employee.access_scope = actor.access_scope
      and not employee.is_deleted
      and employee.sep_date is null;

    return pg_catalog.jsonb_build_object('rows', report_rows);
  end if;

  if p_report_id = 'allEmployees' then
    select coalesce(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'empNo', employee.emp_no,
          'lastName', employee.last_name,
          'firstName', employee.first_name,
          'gender', employee.gender,
          'birthDate', employee.birth_date,
          'hireDate', employee.hire_date,
          'sepDate', employee.sep_date
        ) order by employee.emp_no
      ),
      '[]'::jsonb
    )
    into report_rows
    from public.erp_employees as employee
    where employee.access_scope = actor.access_scope
      and not employee.is_deleted;

    return pg_catalog.jsonb_build_object('rows', report_rows);
  end if;

  if p_report_id = 'empJobHistory' then
    select coalesce(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'empNo', employee.emp_no,
          'firstName', employee.first_name,
          'lastName', employee.last_name
        ) order by employee.emp_no
      ),
      '[]'::jsonb
    )
    into employee_rows
    from public.erp_employees as employee
    where employee.access_scope = actor.access_scope
      and not employee.is_deleted;

    if p_employee_no is null then
      report_rows := '[]'::jsonb;
    else
      if not exists (
        select 1
        from public.erp_employees as employee
        where employee.access_scope = actor.access_scope
          and employee.emp_no = p_employee_no
          and not employee.is_deleted
      ) then
        raise exception 'The selected employee is not available for this report.';
      end if;

      select coalesce(
        pg_catalog.jsonb_agg(
          pg_catalog.jsonb_build_object(
            'effDate', history.eff_date,
            'jobCode', history.job_code,
            'jobDesc', job.job_desc,
            'deptCode', history.dept_code,
            'deptName', department.dept_name,
            'salary', history.salary
          ) order by history.eff_date desc
        ),
        '[]'::jsonb
      )
      into report_rows
      from public.erp_job_histories as history
      left join public.erp_jobs as job
        on job.access_scope = history.access_scope
        and job.job_code = history.job_code
      left join public.erp_departments as department
        on department.access_scope = history.access_scope
        and department.dept_code = history.dept_code
      where history.access_scope = actor.access_scope
        and history.emp_no = p_employee_no
        and not history.is_deleted;
    end if;

    return pg_catalog.jsonb_build_object(
      'employees', employee_rows,
      'rows', report_rows
    );
  end if;

  if p_report_id = 'topSales' then
    with totals as (
      select sale.trans_no, sale.sales_date, sale.cust_no, sale.emp_no,
        coalesce(
          pg_catalog.sum(
            detail.quantity * coalesce(price.unit_price, 0)
          ),
          0
        ) as total
      from public.erp_sales as sale
      left join public.erp_sales_details as detail
        on detail.access_scope = sale.access_scope
        and detail.trans_no = sale.trans_no
        and not detail.is_deleted
      left join lateral (
        select product_price.unit_price
        from public.erp_product_prices as product_price
        where product_price.access_scope = actor.access_scope
          and product_price.prod_code = detail.prod_code
          and not product_price.is_deleted
          and product_price.eff_date <= sale.sales_date
        order by product_price.eff_date desc
        limit 1
      ) as price on true
      where sale.access_scope = actor.access_scope
        and not sale.is_deleted
        and (p_date_from is null or sale.sales_date >= p_date_from)
        and (p_date_to is null or sale.sales_date <= p_date_to)
      group by sale.trans_no, sale.sales_date, sale.cust_no, sale.emp_no
    ),
    ranked as (
      select totals.trans_no, totals.sales_date, totals.cust_no, totals.emp_no, totals.total,
        customer.cust_name,
        employee.first_name,
        employee.last_name,
        pg_catalog.row_number() over (order by totals.total desc, totals.trans_no) as rank
      from totals
      left join public.erp_customers as customer
        on customer.access_scope = actor.access_scope
        and customer.cust_no = totals.cust_no
      left join public.erp_employees as employee
        on employee.access_scope = actor.access_scope
        and employee.emp_no = totals.emp_no
    )
    select coalesce(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'rank', ranked.rank,
          'transNo', ranked.trans_no,
          'date', ranked.sales_date,
          'customer', coalesce(ranked.cust_name, ranked.cust_no),
          'employee', coalesce(
            nullif(pg_catalog.btrim(ranked.first_name || ' ' || ranked.last_name), ''),
            ranked.emp_no
          ),
          'total', ranked.total
        ) order by ranked.rank
      ),
      '[]'::jsonb
    )
    into report_rows
    from ranked
    where ranked.rank <= p_top_count;

    return pg_catalog.jsonb_build_object('rows', report_rows);
  end if;

  raise exception 'Unknown report.';
end;
$$;

revoke execute on function public.get_erp_report(text, date, date, integer, text)
  from public, anon;
grant execute on function public.get_erp_report(text, date, date, integer, text)
  to authenticated;

notify pgrst, 'reload schema';
