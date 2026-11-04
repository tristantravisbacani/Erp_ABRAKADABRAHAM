# Test Case Specification: User Management Console & Access Controls

**Sprint:** Sprint 1 (Week 2, Due Day 8)  
**Task ID:** `S1-TST-03` (Row 27 in Chronological Task Plan)  
**Lead Tester:** Simon Conrad Mangubat (`simonconradmangubat`)  
**Target Deliverables:** `S1-DEV-05`, `S1-DEV-06`, `02_auth_rbac_schema.sql`, `04_seed_users_and_permissions.sql`  
**Status:** Executed & Verified  

---

## 1. Scope & Test Environment

This specification defines the test suite and validation logs for the **User Management Console**, including user account lifecycle administration, table rendering, status filtering, live search queries, administrative role isolation, approval workflows for pending registrations, and fail-safe guards protecting the last remaining Superadmin.

### 1.1 Test Configuration & Platforms
- **Browsers Tested:** Google Chrome 122.0, Mozilla Firefox 123.0, Microsoft Edge 122.0
- **Storage Subsystems:** Local Storage (`hope_erp_users_v4`, `hope_erp_session_v4`), Supabase Cloud PostgreSQL
- **Security & Authorization Framework:** Role-Based Access Control (RBAC), Admin Isolation Boundaries, OWASP ASVS v4.0.3 (Access Control & Privilege Separation)

---

## 2. Test Suite 1: User Account CRUD Operations (`TC-UM-CRUD`)

### TC-UM-01: Create New User Account (Superadmin Context)
- **Description:** Verify that a Superadmin can open the Add User dialog, select any system role (`user`, `admin`, `superadmin`), and persist the new account.
- **Preconditions:** Authenticated as Superadmin (`superadmin@hope.com`). Navigated to User Management.
- **Input Data:**
  - First Name: `Marcus`
  - Last Name: `Vance`
  - Email: `marcus.vance@hope.com`
  - Role: `admin`
  - Status: `active`
- **Execution Steps:**
  1. Click `+ Add User` in the module toolbar.
  2. Confirm `#umUserModal` opens with `#umUserTitle` set to "Add User".
  3. Verify role select `#umRole` offers: `User`, `Admin`, `Superadmin`.
  4. Fill in input fields and submit `#umUserForm`.
- **Expected Result:**
  - Account is added to `window.getUsers()` with full permissions (`window.fullPermissions()`).
  - Modal closes, scroll locks release, and accounts table updates displaying `Marcus Vance` with `admin` badge and `Active` status.
- **Status:** **PASS**

### TC-UM-02: Create New User Account (Admin Context - Role Restriction)
- **Description:** Verify that an Admin can only create standard `user` accounts and cannot create `admin` or `superadmin` accounts.
- **Preconditions:** Authenticated as Admin (`admin@hope.com`).
- **Execution Steps:**
  1. Click `+ Add User`.
  2. Inspect `#umRole` dropdown options.
- **Expected Result:**
  - `#umRole` contains strictly `<option value="user">User</option>`.
  - Attempts to inject higher roles via DOM manipulation are rejected with error: *"Admin can only create User accounts."*
- **Status:** **PASS**

### TC-UM-03: Duplicate Email Validation during Account Creation
- **Description:** Verify that account creation rejects email addresses already registered in the system.
- **Input Data:** Email: `superadmin@hope.com`
- **Execution Steps:**
  1. Click `+ Add User`.
  2. Enter existing email `superadmin@hope.com` and submit.
- **Expected Result:**
  - Submission rejected without database mutation.
  - Error alert `#umUserError` displays: *"Email already exists."*
- **Status:** **PASS**

### TC-UM-04: Edit Existing User Account
- **Description:** Verify editing a user populates existing details, locks email to read-only, and saves updates.
- **Execution Steps:**
  1. Locate user `user@hope.com` in accounts table.
  2. Click `Edit` action button.
  3. Verify `#umEmail` is `readOnly = true`.
  4. Change Last Name to `Updated` and save.
- **Expected Result:**
  - Table re-renders with updated name `Regular User Updated`.
  - User record in storage updates timestamp.
- **Status:** **PASS**

### TC-UM-05: Account Blocking and Unblocking
- **Description:** Verify blocking an active user updates status badge to `Blocked` and prevents login.
- **Execution Steps:**
  1. On active user row (`user@hope.com`), click `Block` button.
  2. Verify status badge changes to `Blocked` (red styling).
  3. Click `Unblock` button on the same row.
- **Expected Result:**
  - Status immediately toggles between `blocked` and `active`.
  - Blocked status successfully inhibits login via `TC-AUTH-03`.
- **Status:** **PASS**

---

## 3. Test Suite 2: Search & Status Filtering (`TC-UM-FILTER`)

### TC-UM-06: Status Tabs Filtering and Count Calculation
- **Description:** Verify filter tabs (`All`, `Active`, `Pending`, `Blocked`) isolate matching accounts and display exact record totals.
- **Execution Steps:**
  1. Click `Active` tab -> Table renders active accounts only.
  2. Click `Pending` tab -> Table renders pending self-registrations only.
  3. Click `Blocked` tab -> Table renders blocked accounts only.
  4. Click `All` tab -> Table renders complete user roster.
- **Expected Result:**
  - Tab pills show exact tallies `All (N)`, `Active (N)`, `Pending (N)`, `Blocked (N)`.
  - Tab active state indicator underlines selected filter.
- **Status:** **PASS**

### TC-UM-07: Live Search Query and Focus Retention
- **Description:** Verify live search input filters rows dynamically across name, email, and role while preserving input focus.
- **Execution Steps:**
  1. Focus search input (`data-focus-key="userSearch"`).
  2. Type query `kurt`.
  3. Verify table filters to `Kurt Abraham` while focus and cursor position remain uninterrupted in input.
  4. Type uppercase domain `@HOPE.COM`.
- **Expected Result:**
  - Table filters in real-time without input blur via `window.rerenderKeepFocus()`.
  - *Observation:* Uppercase email search fails to return records due to case-sensitive check on raw input (logged as `DEF-UM-01`).
- **Status:** **PASS (Defect Logged)**

---

## 4. Test Suite 3: Admin Role Isolation & Privilege Separation (`TC-UM-ISOL`)

### TC-UM-08: Superadmin Account Visibility Isolation
- **Description:** Verify that when an Administrator logs in and opens User Management, Superadmin accounts are completely hidden from the accounts list.
- **Preconditions:** System contains Superadmin (`superadmin@hope.com`), Admin (`admin@hope.com`), and standard Users.
- **Execution Steps:**
  1. Authenticate as Admin (`admin@hope.com`).
  2. Navigate to User Management (`window.navigateTo('users')`).
  3. Inspect accounts table rows and total counter.
- **Expected Result:**
  - Table displays standard users and fellow administrators.
  - `superadmin@hope.com` is completely absent from DOM rows and search queries.
  - Subtitle displays: *"Admin: manage Users only. Superadmin accounts are hidden and cannot be modified."*
- **Status:** **PASS**

### TC-UM-09: Admin Privilege Escalation Prevention
- **Description:** Verify that an Admin cannot promote any standard user or themselves to Admin or Superadmin.
- **Execution Steps:**
  1. While logged in as Admin, click `Edit` on a standard User account.
  2. Attempt to select role `Admin` or `Superadmin`.
- **Expected Result:**
  - Role dropdown `#umRole` provides only `<option value="user">User</option>`.
  - Manual DOM modification attempts to force role `superadmin` are blocked by server/controller logic: *"Admin can only create User accounts."*
- **Status:** **PASS**

### TC-UM-10: Admin Rights Management Boundary
- **Description:** Verify that an Admin can only manage rights for standard users (`role === 'user'`) and cannot modify rights for other administrators.
- **Execution Steps:**
  1. Inspect action buttons for other Admin rows while logged in as Admin.
  2. Inspect action buttons for standard User rows.
- **Expected Result:**
  - `Rights` button is rendered exclusively on rows where `u.role === 'user'`.
  - Admin rows do not display `Rights` button.
- **Status:** **PASS**

---

## 5. Test Suite 4: Account Approval Workflows (`TC-UM-APPR`)

### TC-UM-11: Pending Account Approval Flow (`approveAccount`)
- **Description:** Verify that an Administrator or Superadmin can approve a self-registered user in pending status.
- **Preconditions:** User `elena.reyes@company.com` registered in `pending` status.
- **Execution Steps:**
  1. Navigate to User Management -> click `Pending` tab.
  2. Locate `elena.reyes@company.com`.
  3. Click `Approve` button (`window.approveAccount()`).
- **Expected Result:**
  - Account status immediately updates to `active`.
  - Initial default permissions (`window.sampleUserPermissions()`) are granted.
  - Account disappears from Pending tab and appears in Active tab.
  - User can now authenticate successfully into the dashboard.
- **Status:** **PASS**

### TC-UM-12: Pending Account Disapproval Flow (`disapproveAccount`)
- **Description:** Verify that an Administrator or Superadmin can disapprove a pending registration.
- **Preconditions:** New registration in pending status (`test.pending@example.com`).
- **Execution Steps:**
  1. Click `Disapprove` action button on pending row.
- **Expected Result:**
  - Account status transitions to `disapproved`.
  - Status badge displays red `Disapproved`.
  - Subsequent login attempts by that user fail with: *"This registration was not approved."*
- **Status:** **PASS**

---

## 6. Test Suite 5: Last Superadmin Guard & Self-Protection (`TC-UM-GUARD`)

### TC-UM-13: Last Superadmin Guard — Blocking Prevention
- **Description:** Verify that the system strictly prevents blocking the last active Superadmin account.
- **Preconditions:** Only 1 active Superadmin (`superadmin@hope.com`) exists in the registry.
- **Execution Steps:**
  1. Attempt to call `setAccountStatus('superadmin@hope.com', 'blocked')`.
- **Expected Result:**
  - Operation is blocked immediately.
  - Alert displays: *"Cannot block the last remaining active Superadmin."*
  - Account remains `active`.
- **Status:** **PASS**

### TC-UM-14: Last Superadmin Guard — Role Demotion Prevention
- **Description:** Verify that the system blocks demoting the last active Superadmin to `admin` or `user`.
- **Execution Steps:**
  1. Open Edit modal for the sole Superadmin.
  2. Change role select `#umRole` to `Admin`.
  3. Submit form.
- **Expected Result:**
  - Submission rejected.
  - Error banner `#umUserError` displays: *"Cannot demote or deactivate the last remaining Superadmin."*
  - User role in storage remains `superadmin`.
- **Status:** **PASS**

### TC-UM-15: Last Superadmin Guard — Disapproval Prevention
- **Description:** Verify that calling `disapproveAccount` on the last remaining Superadmin is halted.
- **Execution Steps:**
  1. Execute `window.disapproveAccount('superadmin@hope.com')`.
- **Expected Result:**
  - Operation blocked with alert: *"Cannot disapprove the last remaining Superadmin."*
- **Status:** **PASS**

### TC-UM-16: Self-Protection Guardrails
- **Description:** Verify that authenticated users cannot block or deactivate their own active accounts.
- **Execution Steps:**
  1. Locate current user's row in User Management table.
  2. Verify that `Block` button is suppressed on the self-row.
  3. Attempt to trigger `window.setAccountStatus(window.currentUser.email, 'blocked')` via console.
- **Expected Result:**
  - `Block` button is omitted from action button group for `isSelf`.
  - Manual execution triggers alert: *"You cannot block your own account."*
  - If editing self in modal, changing status from `active` produces validation error.
- **Status:** **PASS**

---

## 7. Formal Test Execution Results Matrix

| Test Case ID | Test Category | Summary / Scenario | Target Role | Result | Defect Logged |
|:---|:---|:---|:---:|:---:|:---:|
| **TC-UM-01** | Account CRUD | Superadmin creates User, Admin, and Superadmin accounts | Superadmin | **PASS** | None |
| **TC-UM-02** | Account CRUD | Admin restricted from creating Admin/Superadmin accounts | Admin | **PASS** | None |
| **TC-UM-03** | Account CRUD | Duplicate email registration rejection | Superadmin | **PASS** | None |
| **TC-UM-04** | Account CRUD | Edit user names and status with immutable email address | Superadmin | **PASS** | None |
| **TC-UM-05** | Account CRUD | Quick block / unblock action toggles | Admin | **PASS** | None |
| **TC-UM-06** | Filter & Search | Filter tabs (`All`, `Active`, `Pending`, `Blocked`) counts | All | **PASS** | None |
| **TC-UM-07** | Filter & Search | Live search filter execution and focus preservation | All | **PASS (Warning)** | `DEF-UM-01` |
| **TC-UM-08** | Role Isolation | Superadmin accounts hidden from Admin users | Admin | **PASS** | None |
| **TC-UM-09** | Role Isolation | Admin role escalation prevention | Admin | **PASS** | None |
| **TC-UM-10** | Role Isolation | Admin restricted to managing standard user rights | Admin | **PASS** | None |
| **TC-UM-11** | Approval Flow | Superadmin / Admin approves pending registration | Superadmin | **PASS** | `DEF-UM-02` |
| **TC-UM-12** | Approval Flow | Superadmin / Admin disapproves pending registration | Admin | **PASS** | None |
| **TC-UM-13** | Guardrails | System blocks blocking last remaining Superadmin | Superadmin | **PASS** | None |
| **TC-UM-14** | Guardrails | System blocks demoting last remaining Superadmin | Superadmin | **PASS** | None |
| **TC-UM-15** | Guardrails | System blocks disapproving last remaining Superadmin | Superadmin | **PASS** | None |
| **TC-UM-16** | Guardrails | Self-blocking and self-demotion prevention | All | **PASS (Warning)** | `DEF-UM-03` |

---

## 8. QA Defect & Inconsistency Log

### DEF-UM-01: Live Search Email Matching is Case-Sensitive
- **Severity:** Medium (Usability / Search Consistency)  
- **Found in:** `js/app.js` (`renderUserManagement`)  
- **Description:** Searching for users by name or role converts queries to lower case (`fullName.includes(q)`), but email search performs an exact case substring match on `u.email.includes(rawTerm)`.  
- **Impact:** Entering `@HOPE.COM` or uppercase letters returns zero results even when corresponding lowercase email addresses exist.  
- **Remediation Recommendation:** Change matching clause to `(u.email && u.email.toLowerCase().includes(q))`.

### DEF-UM-02: Pending Status Badge Inline Style Causes Dark Theme Contrast Mismatch
- **Severity:** Low (UI / Design System Alignment)  
- **Found in:** `js/app.js` (`renderUserManagement`)  
- **Description:** The pending badge is rendered with hardcoded inline style `style="background:#fef3c7;color:#92400e;"` which belongs to light mode. In GitHub Primer dark mode, this produces an un-themed, high-contrast banner.  
- **Remediation Recommendation:** Remove inline style and rely on CSS class `.badge-pending` defined in `css/dashboard.css`.

### DEF-UM-03: Self-Edit Alert Message Copy Inconsistency for Admin Role
- **Severity:** Low (Copywriting / Usability)  
- **Found in:** `js/app.js` (`saveAccount`)  
- **Description:** When an administrator attempts to change their own role or block their account, the alert reads: *"You cannot change your own role or block/deactivate your own account. Contact a Superadmin."* While acceptable, the message assumes a Superadmin must be contacted rather than tailoring the copy when an Admin is viewing their profile.  
- **Remediation Recommendation:** Standardize message or provide contextual copy based on `window.currentUser.role`.

---

## 9. Security Sign-off & RBAC Compliance Audit

- **Admin Isolation Verification:** Verified that `Admin` role accounts have zero access to view, edit, block, or delete `Superadmin` accounts. The isolation boundary is enforced at both the UI query layer and the event handler execution layer.
- **Fail-Safe Superadmin Governance:** Verified that the system strictly prevents locking out the last active Superadmin through blocking, demotion, or registration rejection.
- **Audit Logging Readiness:** All state mutations (`upsertUser`, `setAccountStatus`, `approveAccount`, `disapproveAccount`) operate via standardized storage endpoints aligned with the `audit_user` trigger foundation implemented in `S1-DBA-06`.

**Lead QA Sign-off:**  
*Simon Conrad Mangubat*  
Lead Tester, Hope, Inc. ERP Web Application  
Date: November 4, 2026
