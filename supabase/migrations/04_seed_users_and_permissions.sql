-- ============================================================================
-- Hope, Inc. ERP — 04 Seed Default Users and RBAC Permissions
-- Task: S1-DBA-05 (Seed data: Team member accounts and RBAC permission grants)
-- Role: DB Admin (Mischa Andrei Sir Solis)
-- ============================================================================

-- ============================================================================
-- 1. SEED DEFAULT TEAM USER ACCOUNTS
-- Configures authentic accounts for the 5 agile project team members
-- ============================================================================

INSERT INTO app_user (id, email, password_hash, first_name, last_name, role, status) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'superadmin@hope.com',
    -- Default placeholder hash for demo/testing accounts
    '$2a$10$wT8mQeF8r2hWvC8i7B3v3.L9rIq9y3z6Uo8s0m1A5c8e2k4o7u1wK',
    'Kurt Thomas Jon',
    'Abraham',
    'superadmin',
    'active'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'ceo@hope.com',
    '$2a$10$wT8mQeF8r2hWvC8i7B3v3.L9rIq9y3z6Uo8s0m1A5c8e2k4o7u1wK',
    'Tristan Travis',
    'Bacani',
    'superadmin',
    'active'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'admin@hope.com',
    '$2a$10$wT8mQeF8r2hWvC8i7B3v3.L9rIq9y3z6Uo8s0m1A5c8e2k4o7u1wK',
    'Mischa Andrei Sir',
    'Solis',
    'admin',
    'active'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'manager@hope.com',
    '$2a$10$wT8mQeF8r2hWvC8i7B3v3.L9rIq9y3z6Uo8s0m1A5c8e2k4o7u1wK',
    'Clark Jarred',
    'Deocampo',
    'admin',
    'active'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'user@hope.com',
    '$2a$10$wT8mQeF8r2hWvC8i7B3v3.L9rIq9y3z6Uo8s0m1A5c8e2k4o7u1wK',
    'Simon Conrad',
    'Mangubat',
    'user',
    'active'
  )
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;


-- ============================================================================
-- 2. SEED PERMISSIONS FOR ADMINISTRATIVE ACCOUNTS
-- Superadmin and Admin roles receive unrestricted access across all 41 rights
-- ============================================================================

INSERT INTO user_permission (user_id, right_code, is_allowed)
SELECT 
  u.id, 
  r.right_code, 
  TRUE
FROM app_user u
CROSS JOIN rights_catalogue r
WHERE u.email IN (
  'superadmin@hope.com', 
  'ceo@hope.com', 
  'admin@hope.com', 
  'manager@hope.com'
)
ON CONFLICT (user_id, right_code) 
DO UPDATE SET 
  is_allowed = EXCLUDED.is_allowed,
  updated_at = NOW();


-- ============================================================================
-- 3. SEED PERMISSIONS FOR STANDARD USER ACCOUNT
-- Simon Mangubat (user@hope.com) receives operational permissions:
-- Customers + Products (view/add/edit, no delete), Sales (view/detail),
-- and selected Reports (Product Master, Top Sales).
-- ============================================================================

INSERT INTO user_permission (user_id, right_code, is_allowed)
SELECT 
  u.id, 
  r.right_code,
  CASE 
    WHEN r.right_code IN (
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
    ) THEN TRUE 
    ELSE FALSE 
  END AS is_allowed
FROM app_user u
CROSS JOIN rights_catalogue r
WHERE u.email = 'user@hope.com'
ON CONFLICT (user_id, right_code) 
DO UPDATE SET 
  is_allowed = EXCLUDED.is_allowed,
  updated_at = NOW();
