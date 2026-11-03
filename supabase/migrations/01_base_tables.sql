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
  payterms VARCHAR(20) CHECK (payterms IN ('COD', 'Net 30', 'Net 45', 'Net 60', '30 Days', '60 Days')),
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


-- ============================================================================
-- FOUNDATIONAL SEED DATA
-- ============================================================================

-- Departments
INSERT INTO department (deptcode, deptname, is_deleted, stamp) VALUES
  ('ACT', 'Accounting', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('BR1', 'Sales Branch 1', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('BR2', 'Sales Branch 2', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('EXC', 'Executive', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('HRD', 'Human Resource', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('IT', 'Information Tech', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('PAY', 'Payroll', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('WHS', 'Warehouse', FALSE, 'CREATED system 2026-11-01 9:00 AM')
ON CONFLICT (deptcode) DO NOTHING;

-- Jobs
INSERT INTO job (jobcode, jobdesc, minsalary, maxsalary, is_deleted, stamp) VALUES
  ('PRES', 'President', 80000.00, 150000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('VP', 'Vice president', 60000.00, 100000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('MGR', 'Manager', 40000.00, 70000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('SA1', 'Sales Agent 1', 20000.00, 35000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('SA2', 'Sales Agent 2', 25000.00, 45000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('SPVR', 'Supervisor', 30000.00, 50000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('CLK1', 'Clerk 1', 18000.00, 25000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('CLK2', 'Clerk 2', 22000.00, 30000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('PR1', 'Programmer 1', 30000.00, 50000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('PR2', 'Programmer 2', 45000.00, 75000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('ANYS', 'Analyst', 35000.00, 60000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('ACCT', 'Accountant', 30000.00, 50000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('WMAN', 'Warehouse man', 16000.00, 22000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('HRS', 'HR Specialist', 25000.00, 40000.00, FALSE, 'CREATED system 2026-11-01 9:00 AM')
ON CONFLICT (jobcode) DO NOTHING;

-- Employees
INSERT INTO employee (empno, lastname, firstname, midname, gender, birthdate, hiredate, sepdate, deptcode, jobcode, is_deleted, stamp) VALUES
  ('00001', 'Smith', 'John', 'A', 'M', '1985-02-20', '2010-05-11', NULL, 'EXC', 'PRES', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('00003', 'Smith', 'Jane', 'B', 'F', '1990-05-16', '2010-05-11', NULL, 'EXC', 'VP', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('00005', 'King', 'Don', 'C', 'M', '1986-02-14', '2010-06-23', NULL, 'BR1', 'MGR', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('00007', 'Jenskin', 'Floyd', 'D', 'M', '1990-02-20', '2010-05-30', NULL, 'BR1', 'SA1', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('00009', 'Cerudo', 'Bambie', 'E', 'F', '1983-06-23', '2010-05-30', NULL, 'BR1', 'SA2', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('00011', 'Davis', 'Tom', 'F', 'M', '1989-12-16', '2010-06-30', NULL, 'IT', 'PR1', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('00013', 'Morris', 'Olive', 'G', 'F', '1991-07-21', '2010-06-30', NULL, 'IT', 'PR2', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('00015', 'Zulueta', 'Maggie', 'H', 'F', '1990-08-03', '2010-07-05', '2011-03-30', 'HRD', 'HRS', FALSE, 'CREATED system 2026-11-01 9:00 AM')
ON CONFLICT (empno) DO NOTHING;

-- Customers
INSERT INTO customer (customerno, custname, address, contactno, creditlimit, payterms, is_deleted, stamp) VALUES
  ('C0001', 'Globus Medical, Inc', '2560 Gen Armistead Ave Audubon CA 94031', '555-0101', 50000.00, '30 Days', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('C0002', 'RF Industries, Inc', '7610 Miramar Rd San Diego, CA 92602', '555-0102', 35000.00, '60 Days', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('C0003', 'Trisha Macdowell', '7642 Clairemont Mesa Blvd San Diego CA 90321', '555-0103', NULL, 'COD', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('C0004', 'HMS Holdings, Inc', '1000 So Fremont Ave, Suite 225 Alhambara CA 91303', '555-0104', 75000.00, '60 Days', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('C0005', 'Christian Andersen', '1120 Lincoln St Suite 809 Sacramento CA 95815', '555-0105', NULL, 'COD', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('C0006', 'Astronics, Inc', '2 Orion Aliso Viejo, CA 92656', '555-0106', 40000.00, '30 Days', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('C0007', 'Morgan Alegore', '2 Goodyear Irvine, CA 92618', '555-0107', NULL, 'COD', FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('C0008', 'Abaxis, Inc', '3240 Whipple Rd, Union City, CA 94587', '555-0108', 60000.00, '30 Days', FALSE, 'CREATED system 2026-11-01 9:00 AM')
ON CONFLICT (customerno) DO NOTHING;

-- Products
INSERT INTO product (prodno, prodname, unit, price, reorderlevel, is_deleted, stamp) VALUES
  ('P0001', 'Laser Printer Pro', 'UNIT', 450.00, 5, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('P0002', 'Wireless Barcode Scanner', 'PC', 85.00, 15, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('P0003', 'Ergonomic Desk Chair', 'PC', 175.00, 8, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('P0004', 'Thermal Receipt Paper (Box)', 'BOX', 35.00, 20, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('P0005', '24-Inch IPS Monitor', 'UNIT', 160.00, 10, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('P0006', 'Cat6 Ethernet Cable 50ft', 'PC', 18.50, 25, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('P0007', 'Heavy-Duty Stapler', 'PC', 22.00, 12, FALSE, 'CREATED system 2026-11-01 9:00 AM'),
  ('P0008', 'A4 Copy Paper (5 Reams)', 'BOX', 28.00, 30, FALSE, 'CREATED system 2026-11-01 9:00 AM')
ON CONFLICT (prodno) DO NOTHING;
