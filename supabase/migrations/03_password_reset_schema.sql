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
