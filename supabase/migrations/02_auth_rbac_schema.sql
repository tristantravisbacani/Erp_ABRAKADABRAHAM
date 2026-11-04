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
