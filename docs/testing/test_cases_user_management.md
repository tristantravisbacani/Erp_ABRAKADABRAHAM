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
