do $$
declare
  updated_profiles integer;
begin
  update public.profiles as profile
  set
    first_name = case lower(profile.email)
      when 'ceo@hope.com' then 'Tristan Travis'
      when 'superadmin@hope.com' then 'Kurt Thomas Jon'
      when 'admin@hope.com' then 'Mischa Andrei Sir'
      when 'manager@hope.com' then 'Clark Jarred'
      when 'user@hope.com' then 'Simon Conrad'
    end,
    last_name = case lower(profile.email)
      when 'ceo@hope.com' then 'Bacani'
      when 'superadmin@hope.com' then 'Abraham'
      when 'admin@hope.com' then 'Solis'
      when 'manager@hope.com' then 'Deocampo'
      when 'user@hope.com' then 'Mangubat'
    end,
    role = case lower(profile.email)
      when 'ceo@hope.com' then 'superadmin'
      when 'superadmin@hope.com' then 'superadmin'
      when 'admin@hope.com' then 'admin'
      when 'manager@hope.com' then 'admin'
      when 'user@hope.com' then 'user'
    end,
    account_status = 'active',
    access_scope = 'sandbox'
  where lower(profile.email) in (
    'ceo@hope.com',
    'superadmin@hope.com',
    'admin@hope.com',
    'manager@hope.com',
    'user@hope.com'
  );

  get diagnostics updated_profiles = row_count;
  if updated_profiles <> 5 then
    raise exception
      'Expected 5 demo profiles; updated %. Create all five Supabase Auth users first, then rerun this script.',
      updated_profiles;
  end if;

  insert into public.user_permissions (user_id, permission, enabled)
  select profile.id, permission, true
  from public.profiles as profile
  cross join unnest(array[
    'customers.view',
    'customers.add',
    'customers.edit',
    'products.view',
    'products.add',
    'products.edit',
    'sales.view',
    'sales.detailView',
    'reports.view',
    'reports.productMaster',
    'reports.topSales'
  ]) as demo_permissions(permission)
  where lower(profile.email) = 'user@hope.com'
  on conflict (user_id, permission) do update
    set enabled = excluded.enabled;
end;
$$;
