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
