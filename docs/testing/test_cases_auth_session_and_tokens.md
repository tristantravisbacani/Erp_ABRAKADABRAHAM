# Test Case Specification: Registration, Authentication & Reset Tokens

**Sprint:** Sprint 1 (Week 2, Due Day 7)  
**Task ID:** `S1-TST-02` (Row 23 in Chronological Task Plan)  
**Lead Tester:** Simon Conrad Mangubat (`simonconradmangubat`)  
**Target Deliverables:** `S1-DEV-02`, `S1-DEV-03`, `S1-DEV-04`, `S1-DBA-03`, `S1-DBA-04`  
**Status:** Executed & Verified  

---

## 1. Scope & Test Environment

This document defines formal test specifications and verification logs for the complete user authentication and account lifecycle, covering user self-registration, role/status gatekeeping, persistent session storage, and single-use password reset tokens.

### 1.1 Test Configuration
- **Browser Platforms:** Google Chrome (v122+), Mozilla Firefox (v123+), Microsoft Edge (v122+)
- **Storage Subsystems:** Local Storage (`hope_erp_users_v4`, `hope_erp_session_v4`, `hope_erp_reset_tokens`), Supabase PostgreSQL
- **Security Baseline:** OWASP ASVS v4.0.3 (Authentication & Session Management)

---

## 2. Test Suite 1: User Registration (`TC-REG`)

### TC-REG-01: Standard User Self-Registration
- **Description:** Verify that a new user registration initializes with `status: 'pending'`, role `'user'`, and `emptyPermissions()`.
- **Preconditions:** Landing page loaded; user does not exist in registry.
- **Input Data:**
  - First Name: `Elena`
  - Last Name: `Reyes`
  - Email: `elena.reyes@company.com`
- **Execution Steps:**
  1. Open `#registerModal` by clicking "Create new account".
  2. Fill in the First Name, Last Name, and Email fields.
  3. Click "Register".
- **Expected Result:**
  - User record is persisted with status `pending`.
  - Green alert message displayed: *"Registration submitted. An admin must approve your account before you can sign in."*
  - Form fields reset to blank.
- **Status:** **PASS**

### TC-REG-02: Duplicate Email Rejection
- **Description:** Verify that attempting to register with an existing registered email address is rejected.
- **Preconditions:** User `superadmin@hope.com` exists in user registry.
- **Input Data:** Email: `superadmin@hope.com`
- **Execution Steps:**
  1. Open `#registerModal`.
  2. Input duplicate email address and submit.
- **Expected Result:**
  - Registration halted without database alteration.
  - Error alert displayed: *"An account with this email already exists. Please sign in."*
- **Status:** **PASS**

### TC-REG-03: Email Format and Syntax Validation
- **Description:** Verify email input pattern rejection for illegal characters (`'`, `"`, `<`, `>`, `&`).
- **Input Data:** `invalid'user@company.com`
- **Expected Result:** HTML5 pattern validation blocks submission with validation tooltip.
- **Status:** **PASS**

---

## 3. Test Suite 2: Authentication & Session Management (`TC-AUTH`)

### TC-AUTH-01: Valid Credential Sign-in
- **Description:** Verify successful authentication transitions user to dashboard and populates user info.
- **Input Data:** Email: `superadmin@hope.com`, Password: `any`
- **Expected Result:**
  - View toggles: `#landing` hidden, `#dashboard` visible.
  - Topbar user pill displays avatar initial `K`, name `Kurt Abraham`, role badge `SUPERADMIN`.
  - Session saved in `localStorage.getItem('hope_erp_session_v4')`.
- **Status:** **PASS**

### TC-AUTH-02: Pending Account Sign-in Denial
- **Description:** Verify that an unapproved user with status `'pending'` cannot sign in.
- **Preconditions:** Account registered via `TC-REG-01` (`elena.reyes@company.com`).
- **Execution Steps:**
  1. Enter `elena.reyes@company.com` in `#loginEmail`.
  2. Submit login form.
- **Expected Result:**
  - Login rejected; `#dashboard` remains hidden.
  - Error alert displayed: *"This account is pending approval. Contact an administrator."*
- **Status:** **PASS**

### TC-AUTH-03: Blocked / Suspended Account Access Denial
- **Description:** Verify that a user flagged as `'blocked'` is refused entry.
- **Preconditions:** User `user.blocked@hope.com` configured with status `'blocked'`.
- **Expected Result:**
  - Error alert displayed: *"This account is blocked. Contact an administrator."*
  - Zero session tokens or credentials saved.
- **Status:** **PASS**

### TC-AUTH-04: Session Recovery & Logout State Teardown
- **Description:** Verify persistent session survives page refresh, and logout clears state.
- **Execution Steps:**
  1. Sign in as `admin@hope.com`.
  2. Reload browser tab $\rightarrow$ Verify dashboard immediately restored.
  3. Open user dropdown $\rightarrow$ Click "Logout".
- **Expected Result:**
  - `localStorage` session key `hope_erp_session_v4` removed.
  - User returned to clean landing view with empty password field.
- **Status:** **PASS**


---

## 4. Test Suite 3: Password Reset & Token Lifecycle (`TC-RST`)

### TC-RST-01: Token Generation & Simulation Dispatch
- **Description:** Verify requesting a reset link creates a 64-character token with expiration.
- **Input Data:** Email: `user@hope.com`
- **Execution Steps:**
  1. Open `#resetModal` by clicking "Forgot password?".
  2. Input `user@hope.com` and submit "Send Reset Link".
- **Expected Result:**
  - Token created in `hope_erp_reset_tokens` with 64 hex characters.
  - Success alert displayed: *"If an account exists for user@hope.com, a secure reset link has been dispatched."*
  - `#resetTokenSection` revealed with token pre-filled for testing.
- **Status:** **PASS**

### TC-RST-02: Password Update via Valid Token
- **Description:** Verify valid token permits updating the account password and redirecting to sign-in.
- **Input Data:**
  - Token: Valid generated 64-char token
  - New Password: `SecurePass#2026`
  - Confirm Password: `SecurePass#2026`
- **Execution Steps:**
  1. Submit `#setNewPasswordForm` with matching passwords.
- **Expected Result:**
  - Password record updated in user store.
  - Token state flagged as `isUsed: true`.
  - Success message: *"Password successfully updated! Redirecting to sign in..."*
  - User redirected to login modal after 1.2s delay.
- **Status:** **PASS**

### TC-RST-03: Single-Use Token Guard (Reused Token Invalidation)
- **Description:** Verify that an already-used token cannot be used a second time.
- **Preconditions:** Token used successfully in `TC-RST-02`.
- **Execution Steps:**
  1. Re-submit the same token with a different password.
- **Expected Result:**
  - Password update rejected.
  - Error alert displayed: *"This reset token has already been used."*
- **Status:** **PASS**

### TC-RST-04: Expired Token Rejection
- **Description:** Verify that an expired token (`expiresAt < Date.now()`) is blocked.
- **Test Dataset:** Token injected with `expiresAt = Date.now() - 3600000` (1 hour in the past).
- **Execution Steps:**
  1. Paste expired token into `#resetToken` and submit form.
- **Expected Result:**
  - Password update blocked.
  - Error alert displayed: *"This reset token has expired. Request a new link."*
- **Status:** **PASS**

### TC-RST-05: Password Mismatch & Length Boundary Checks
- **Description:** Verify password policy validation (minimum 6 characters, matching inputs).
- **Test Scenarios:**
  - Scenario A: New = `12345`, Confirm = `12345` $\rightarrow$ Rejected: *"Password must be at least 6 characters long."*
  - Scenario B: New = `Secret1`, Confirm = `Secret2` $\rightarrow$ Rejected: *"Passwords do not match."*
- **Status:** **PASS**
