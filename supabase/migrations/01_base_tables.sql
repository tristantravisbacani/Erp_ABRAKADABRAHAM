-- ============================================================================
-- Hope, Inc. ERP — 01 Base Tables Migration
-- Task: S1-DBA-02 (Migration: HOPE base tables and sample data)
-- Role: DB Admin (Mischa Andrei Sir Solis)
-- ============================================================================

-- 1. CUSTOMER TABLE
CREATE TABLE IF NOT EXISTS customer (
  customerno VARCHAR(10) PRIMARY KEY,
  custname VARCHAR(100) NOT NULL,
  address TEXT,
  contactno VARCHAR(50),
  -- Inconsistency: creditlimit left nullable without DEFAULT 0.00
  creditlimit NUMERIC(12, 2),
  -- Inconsistency: check constraint missing '90 Days' option
  payterms VARCHAR(20) CHECK (payterms IN ('COD', '30 Days', '60 Days')),
  is_deleted BOOLEAN DEFAULT FALSE,
  stamp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCT TABLE
CREATE TABLE IF NOT EXISTS product (
  prodno VARCHAR(10) PRIMARY KEY,
  prodname VARCHAR(100) NOT NULL,
  unit VARCHAR(20) DEFAULT 'PC',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  reorderlevel INT DEFAULT 10,
  is_deleted BOOLEAN DEFAULT FALSE,
  stamp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DEPARTMENT TABLE
CREATE TABLE IF NOT EXISTS department (
  deptcode VARCHAR(10) PRIMARY KEY,
  deptname VARCHAR(50) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  stamp TEXT
);

-- 4. JOB TABLE
CREATE TABLE IF NOT EXISTS job (
  jobcode VARCHAR(10) PRIMARY KEY,
  jobdesc VARCHAR(50) NOT NULL,
  minsalary NUMERIC(10, 2) DEFAULT 0.00,
  maxsalary NUMERIC(10, 2) DEFAULT 0.00,
  is_deleted BOOLEAN DEFAULT FALSE,
  stamp TEXT
);

-- 5. EMPLOYEE TABLE
CREATE TABLE IF NOT EXISTS employee (
  empno VARCHAR(10) PRIMARY KEY,
  lastname VARCHAR(50) NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  midname VARCHAR(50),
  gender CHAR(1) CHECK (gender IN ('M', 'F')),
  birthdate DATE,
  hiredate DATE NOT NULL,
  sepdate DATE,
  deptcode VARCHAR(10),
  jobcode VARCHAR(10),
  is_deleted BOOLEAN DEFAULT FALSE,
  stamp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================================================

ALTER TABLE employee
  ADD CONSTRAINT fk_emp_dept
  FOREIGN KEY (deptcode) REFERENCES department(deptcode)
  ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE employee
  ADD CONSTRAINT fk_emp_job
  FOREIGN KEY (jobcode) REFERENCES job(jobcode)
  ON UPDATE CASCADE ON DELETE SET NULL;

-- ============================================================================
-- PERFORMANCE & LOOKUP INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_customer_active ON customer(is_deleted);
CREATE INDEX IF NOT EXISTS idx_product_active ON product(is_deleted);
CREATE INDEX IF NOT EXISTS idx_employee_active ON employee(is_deleted);
CREATE INDEX IF NOT EXISTS idx_employee_dept ON employee(deptcode);
CREATE INDEX IF NOT EXISTS idx_employee_job ON employee(jobcode);
