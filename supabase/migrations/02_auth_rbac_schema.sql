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
