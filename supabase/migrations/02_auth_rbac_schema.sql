-- ============================================================================
-- Hope, Inc. ERP — 02 Auth and RBAC Schema Migration
-- Task: S1-DBA-03 (Migration: User auth, roles, modules, rights, permissions)
-- Role: DB Admin (Mischa Andrei Sir Solis)
-- ============================================================================

-- Enable pgcrypto extension for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. ROLE CATALOG TABLE
-- Defines standard organizational roles and system hierarchies
-- ============================================================================

CREATE TABLE IF NOT EXISTS role (
  role_code VARCHAR(20) PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed standard roles
INSERT INTO role (role_code, display_name, description) VALUES
  ('superadmin', 'Super Administrator', 'Full unhindered system and organizational access'),
  ('admin', 'Administrator', 'Administrative access to manage operations and users'),
  ('user', 'Standard User', 'Operational user access bounded by assigned rights catalogue permissions'),
  ('guest', 'Guest', 'Read-only exploratory access to public module previews')
ON CONFLICT (role_code) DO NOTHING;


-- ============================================================================
-- 2. MODULE CATALOG TABLE
-- Registers top-level ERP functional domains for permission grouping
-- ============================================================================

CREATE TABLE IF NOT EXISTS module (
  module_code VARCHAR(20) PRIMARY KEY,
  module_name VARCHAR(50) NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed core ERP modules matching master prototype
INSERT INTO module (module_code, module_name, sort_order) VALUES
  ('customers', 'Customer Management', 1),
  ('products', 'Product Management', 2),
  ('hr', 'Human Resources', 3),
  ('sales', 'Sales & Invoicing', 4),
  ('reports', 'Reports & Analytics', 5)
ON CONFLICT (module_code) DO NOTHING;


-- ============================================================================
-- 3. APPLICATION USER TABLE
-- Handles authentication, role binding, registration states, and soft deletion
-- ============================================================================

CREATE TABLE IF NOT EXISTS app_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' REFERENCES role(role_code) ON UPDATE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'rejected', 'suspended')),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimization indexes for user lookups and authentication queries
CREATE INDEX IF NOT EXISTS idx_app_user_email ON app_user(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_app_user_status ON app_user(status);
CREATE INDEX IF NOT EXISTS idx_app_user_role ON app_user(role);
CREATE INDEX IF NOT EXISTS idx_app_user_active ON app_user(is_deleted);


-- ============================================================================
-- 4. RIGHTS CATALOGUE TABLE
-- Authoritative catalog of all granular privileges mapped to functional modules
-- ============================================================================

CREATE TABLE IF NOT EXISTS rights_catalogue (
  right_code VARCHAR(50) PRIMARY KEY,
  module_code VARCHAR(20) NOT NULL REFERENCES module(module_code) ON UPDATE CASCADE ON DELETE CASCADE,
  right_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_view_right BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed comprehensive rights inventory matching master blueprint (41 rights)
INSERT INTO rights_catalogue (right_code, module_code, right_name, description, is_view_right, sort_order) VALUES
  -- Customer Management (4 rights)
  ('customers.view', 'customers', 'View Customers', 'Access customer module screens and directories', TRUE, 10),
  ('customers.add', 'customers', 'Add Customer', 'Create new customer profiles and credit records', FALSE, 20),
  ('customers.edit', 'customers', 'Edit Customer', 'Modify existing customer profiles and terms', FALSE, 30),
  ('customers.delete', 'customers', 'Delete Customer', 'Soft delete customer records', FALSE, 40),

  -- Product Management (7 rights)
  ('products.view', 'products', 'View Products', 'Access product catalogue and inventory lists', TRUE, 10),
  ('products.add', 'products', 'Add Product', 'Create new product listings in master catalog', FALSE, 20),
  ('products.edit', 'products', 'Edit Product', 'Update item details, descriptions, and units', FALSE, 30),
  ('products.delete', 'products', 'Delete Product', 'Soft delete product catalog items', FALSE, 40),
  ('products.priceAdd', 'products', 'Add Price', 'Register new price points and pricing tiers', FALSE, 50),
  ('products.priceEdit', 'products', 'Edit Price', 'Adjust unit prices and price histories', FALSE, 60),
  ('products.priceDelete', 'products', 'Delete Price', 'Remove expired or invalid pricing entries', FALSE, 70),

  -- Human Resources (14 rights)
  ('hr.view', 'hr', 'View Human Resources', 'Access HR dashboard and personnel rosters', TRUE, 10),
  ('hr.jobAdd', 'hr', 'Add Job', 'Define new job roles and salary grade ranges', FALSE, 20),
  ('hr.jobEdit', 'hr', 'Edit Job', 'Modify job titles, codes, and salary boundaries', FALSE, 30),
  ('hr.jobDelete', 'hr', 'Delete Job', 'Archive or delete unused job titles', FALSE, 40),
  ('hr.deptAdd', 'hr', 'Add Department', 'Create new organizational departments', FALSE, 50),
  ('hr.deptEdit', 'hr', 'Edit Department', 'Update department names and metadata', FALSE, 60),
  ('hr.deptDelete', 'hr', 'Delete Department', 'Archive or delete corporate departments', FALSE, 70),
  ('hr.empAdd', 'hr', 'Add Employee', 'Onboard new personnel into company records', FALSE, 80),
  ('hr.empEdit', 'hr', 'Edit Employee', 'Update employee profiles, jobs, and departments', FALSE, 90),
  ('hr.empDelete', 'hr', 'Delete Employee', 'Mark employees separated or archive profiles', FALSE, 100),
  ('hr.jhView', 'hr', 'View Job History', 'Audit career movement, promotions, and changes', FALSE, 110),
  ('hr.jhAdd', 'hr', 'Add Job History', 'Record new job transitions and position changes', FALSE, 120),
  ('hr.jhEdit', 'hr', 'Edit Job History', 'Modify career transition audit logs', FALSE, 130),
  ('hr.jhDelete', 'hr', 'Delete Job History', 'Remove erroneous job history entries', FALSE, 140),

  -- Sales & Invoicing (8 rights)
  ('sales.view', 'sales', 'View Sales', 'View sales invoices, orders, and receipts', TRUE, 10),
  ('sales.add', 'sales', 'Add Sale', 'Create and issue sales transactions', FALSE, 20),
  ('sales.edit', 'sales', 'Edit Sale', 'Revise draft or active sales transactions', FALSE, 30),
  ('sales.delete', 'sales', 'Delete Sale', 'Void or delete sales transactions', FALSE, 40),
  ('sales.detailView', 'sales', 'View Sale Details', 'Inspect itemized lines on sales orders', FALSE, 50),
  ('sales.detailAdd', 'sales', 'Add Sale Detail', 'Append line items to active sales orders', FALSE, 60),
  ('sales.detailEdit', 'sales', 'Edit Sale Detail', 'Update line quantities and line discounts', FALSE, 70),
  ('sales.detailDelete', 'sales', 'Delete Sale Detail', 'Remove line items from sales transactions', FALSE, 80),

  -- Reports & Analytics (8 rights)
  ('reports.view', 'reports', 'View Reports', 'Access reports workspace and dashboards', TRUE, 10),
  ('reports.topCustomers', 'reports', 'Top Customers', 'Generate revenue by customer report', FALSE, 20),
  ('reports.productMaster', 'reports', 'Product Master List', 'Generate full inventory master listing', FALSE, 30),
  ('reports.topProducts', 'reports', 'Top Products', 'Generate top selling item summaries', FALSE, 40),
  ('reports.activeEmployees', 'reports', 'Active Employees', 'Generate headcount and active roster report', FALSE, 50),
  ('reports.allEmployees', 'reports', 'All Employees', 'Generate historical employee master listing', FALSE, 60),
  ('reports.empJobHistory', 'reports', 'Employee Job History', 'Generate promotion and career path report', FALSE, 70),
  ('reports.topSales', 'reports', 'Top Sales', 'Generate executive high-value transaction digest', FALSE, 80)
ON CONFLICT (right_code) DO NOTHING;


-- ============================================================================
-- 5. USER PERMISSIONS TABLE
-- Granular per-user privilege grants with audit trail and soft delete support
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_permission (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_user(id) ON UPDATE CASCADE ON DELETE CASCADE,
  right_code VARCHAR(50) NOT NULL REFERENCES rights_catalogue(right_code) ON UPDATE CASCADE ON DELETE CASCADE,
  is_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_permission UNIQUE (user_id, right_code)
);

-- Optimization indexes for permission resolution and lookups
CREATE INDEX IF NOT EXISTS idx_rights_catalogue_module ON rights_catalogue(module_code);
CREATE INDEX IF NOT EXISTS idx_user_permission_user ON user_permission(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permission_right ON user_permission(right_code);
CREATE INDEX IF NOT EXISTS idx_user_permission_lookup ON user_permission(user_id, right_code, is_allowed) WHERE NOT is_deleted;
