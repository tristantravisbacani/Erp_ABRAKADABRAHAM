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
