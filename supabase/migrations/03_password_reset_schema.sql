-- ============================================================================
-- Hope, Inc. ERP — 03 Password Reset Schema Migration
-- Task: S1-DBA-04 (Password reset tokens, expiration intervals, usage tracking)
-- Role: DB Admin (Mischa Andrei Sir Solis)
-- ============================================================================

-- ============================================================================
-- 1. PASSWORD RESET TOKEN TABLE
-- Tracks time-limited, single-use authentication reset tokens
-- ============================================================================

CREATE TABLE IF NOT EXISTS password_reset_token (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON UPDATE CASCADE ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours'),
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- 2. LOOKUP & AUDIT INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_password_reset_token_lookup 
  ON password_reset_token(token) 
  WHERE NOT is_used;

CREATE INDEX IF NOT EXISTS idx_password_reset_user 
  ON password_reset_token(user_id);


-- ============================================================================
-- 3. TOKEN VALIDATION HELPER FUNCTION
-- Validates token existence, expiration, and prior usage
-- ============================================================================

CREATE OR REPLACE FUNCTION verify_reset_token(p_token VARCHAR)
RETURNS TABLE (
  is_valid BOOLEAN,
  user_id UUID,
  email VARCHAR,
  message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE
      WHEN t.id IS NULL THEN FALSE
      WHEN t.is_used THEN FALSE
      WHEN t.expires_at < NOW() THEN FALSE
      ELSE TRUE
    END AS is_valid,
    u.id AS user_id,
    u.email,
    CASE
      WHEN t.id IS NULL THEN 'Token not found.'
      WHEN t.is_used THEN 'Token has already been used.'
      WHEN t.expires_at < NOW() THEN 'Token has expired.'
      ELSE 'Token is valid.'
    END AS message
  FROM password_reset_token t
  JOIN app_user u ON u.id = t.user_id
  WHERE t.token = p_token
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 4. CLEANUP PROCEDURE
-- Purges old expired reset tokens beyond 30 days retention
-- ============================================================================

CREATE OR REPLACE FUNCTION purge_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM password_reset_token
  WHERE expires_at < (NOW() - INTERVAL '30 days')
     OR (is_used = TRUE AND used_at < (NOW() - INTERVAL '30 days'));
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;
