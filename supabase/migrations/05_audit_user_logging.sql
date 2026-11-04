-- ============================================================================
-- Hope, Inc. ERP — 05 Audit User Logging Migration
-- Task: S1-DBA-06 (Make audit_user() record the logged-in user in audit_log; test it)
-- Role: DB Admin (Mischa Andrei Sir Solis)
-- ============================================================================

-- ============================================================================
-- 1. AUDIT LOG TABLE
-- Historical record of all mutation events, old/new data payloads, and authors
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'RESTORE')),
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  changed_by VARCHAR(255) NOT NULL DEFAULT 'system',
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optimization indexes for audit trail queries and actor auditing
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by ON audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON audit_log(changed_at DESC);


-- ============================================================================
-- 2. AUDIT USER TRIGGER FUNCTION
-- Resolves the current session user and records mutation attribution
-- ============================================================================

CREATE OR REPLACE FUNCTION audit_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user VARCHAR(255);
  v_record_id TEXT;
  v_action VARCHAR(10);
  v_old_json JSONB := NULL;
  v_new_json JSONB := NULL;
  v_stamp TEXT;
BEGIN
  -- Resolve active session user from app context, Supabase JWT, or DB current_user
  v_user := COALESCE(
    NULLIF(current_setting('app.current_user_email', true), ''),
    NULLIF(current_setting('request.jwt.claims', true)::json->>'email', ''),
    NULLIF(current_setting('request.jwt.claim.email', true), ''),
    current_user,
    'system'
  );

  v_action := TG_OP;
  v_stamp := (
    CASE TG_OP
      WHEN 'INSERT' THEN 'CREATED '
      WHEN 'UPDATE' THEN (
        -- Differentiate soft-delete / restore actions if table supports is_deleted
        CASE 
          WHEN TG_ARGV[0] = 'has_soft_delete' AND (OLD.is_deleted = FALSE AND NEW.is_deleted = TRUE) THEN 'DELETED '
          WHEN TG_ARGV[0] = 'has_soft_delete' AND (OLD.is_deleted = TRUE AND NEW.is_deleted = FALSE) THEN 'RESTORED '
          ELSE 'UPDATED '
        END
      )
      WHEN 'DELETE' THEN 'DELETED '
      ELSE 'MUTATED '
    END
  ) || v_user || ' ' || to_char(NOW(), 'YYYY-MM-DD HH12:MI AM');

  IF TG_OP = 'INSERT' THEN
    v_new_json := to_jsonb(NEW);
    v_record_id := COALESCE(
      NEW.customerno::TEXT, 
      NEW.prodno::TEXT, 
      NEW.empno::TEXT, 
      NEW.id::TEXT, 
      'UNKNOWN'
    );
    -- Update stamp on new row if column exists
    NEW.stamp := v_stamp;
    IF TG_ARGV[1] = 'has_timestamps' THEN
      NEW.updated_at := NOW();
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    v_old_json := to_jsonb(OLD);
    v_new_json := to_jsonb(NEW);
    v_record_id := COALESCE(
      NEW.customerno::TEXT, 
      NEW.prodno::TEXT, 
      NEW.empno::TEXT, 
      NEW.id::TEXT, 
      'UNKNOWN'
    );
    -- Update stamp and updated_at
    NEW.stamp := v_stamp;
    IF TG_ARGV[1] = 'has_timestamps' THEN
      NEW.updated_at := NOW();
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    v_old_json := to_jsonb(OLD);
    v_record_id := COALESCE(
      OLD.customerno::TEXT, 
      OLD.prodno::TEXT, 
      OLD.empno::TEXT, 
      OLD.id::TEXT, 
      'UNKNOWN'
    );
  END IF;

  -- Insert audit trail row
  INSERT INTO audit_log (
    table_name,
    action,
    record_id,
    old_data,
    new_data,
    changed_by,
    changed_at
  ) VALUES (
    TG_TABLE_NAME::VARCHAR,
    v_action,
    v_record_id,
    v_old_json,
    v_new_json,
    v_user,
    NOW()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 3. ATTACH AUDIT TRIGGERS TO CORE TABLES
-- ============================================================================

-- Customer Table Audit Trigger
DROP TRIGGER IF EXISTS trg_audit_customer ON customer;
CREATE TRIGGER trg_audit_customer
  BEFORE INSERT OR UPDATE ON customer
  FOR EACH ROW
  EXECUTE FUNCTION audit_user('has_soft_delete', 'has_timestamps');

-- Product Table Audit Trigger
DROP TRIGGER IF EXISTS trg_audit_product ON product;
CREATE TRIGGER trg_audit_product
  BEFORE INSERT OR UPDATE ON product
  FOR EACH ROW
  EXECUTE FUNCTION audit_user('has_soft_delete', 'has_timestamps');

-- Employee Table Audit Trigger
DROP TRIGGER IF EXISTS trg_audit_employee ON employee;
CREATE TRIGGER trg_audit_employee
  BEFORE INSERT OR UPDATE ON employee
  FOR EACH ROW
  EXECUTE FUNCTION audit_user('has_soft_delete', 'has_timestamps');

-- Application User Table Audit Trigger
DROP TRIGGER IF EXISTS trg_audit_app_user ON app_user;
CREATE TRIGGER trg_audit_app_user
  BEFORE INSERT OR UPDATE ON app_user
  FOR EACH ROW
  EXECUTE FUNCTION audit_user('has_soft_delete', 'has_timestamps');


-- ============================================================================
-- 4. VERIFICATION TEST SUITE & SAMPLE AUDIT PROCEDURES
-- ============================================================================

DO $$
BEGIN
  -- Simulate session context for authenticated administrator
  PERFORM set_config('app.current_user_email', 'admin@hope.com', true);

  -- Perform verifiable mutation on customer C0001
  UPDATE customer 
  SET creditlimit = creditlimit + 1000.00
  WHERE customerno = 'C0001';

  -- Reset credit limit back to original value
  UPDATE customer 
  SET creditlimit = creditlimit - 1000.00
  WHERE customerno = 'C0001';
END $$;

-- Verification Query Checklist (for database administration audits):
-- 1. Inspect recent mutations by actor:
--    SELECT * FROM audit_log WHERE changed_by = 'admin@hope.com' ORDER BY changed_at DESC LIMIT 5;
-- 2. Inspect record mutation lineage:
--    SELECT table_name, action, record_id, changed_by, changed_at FROM audit_log WHERE record_id = 'C0001';
-- 3. Verify stamp column reflection:
--    SELECT customerno, custname, stamp FROM customer WHERE customerno = 'C0001';
