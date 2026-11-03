# Sprint 1 Master Test Plan & Quality Assurance Strategy

**Project:** Hope, Inc. ERP Web Application  
**Sprint:** 1 (Weeks 1–2)  
**Lead Tester:** Simon Conrad Mangubat  
**Status:** Active  

---

## 1. Objectives & Scope

This Master Test Plan defines the verification strategy, test case specifications, and acceptance criteria for all deliverables in Sprint 1.

### 1.1 In-Scope Modules & Capabilities
1. **System Infrastructure & Environment:** Hybrid database connectivity (Supabase Cloud live instance vs LocalStorage offline fallback).
2. **User Authentication & Session Management:**
   - Account registration and pending state validation.
   - User sign-in, session persistence, and logout flow.
   - Password reset request and one-time token simulation.
   - Account blocking enforcement (blocked users cannot access ERP).
3. **User Management Console (Admin & Superadmin):**
   - User list rendering, status filters (active, pending, blocked).
   - Superadmin approval/disapproval workflows.
   - Role designation and protection of Superadmin accounts from non-superadmin edits.
   - Last-superadmin guard (blocking deletion/disabling of the sole superadmin).
4. **36-Action Rights Catalogue & Granular Access Control:**
   - Verification of the 36 individual action permissions across all 5 operational modules.
   - Module group quick-selection (All / None) toggles.
   - Dynamic sidebar navigation rendering according to active permissions.
5. **Design System & Visual Hygiene:**
   - Consistency across buttons, badges, typography, alerts, and modal dialogs.


---

## 2. Test Case Inventory & Verification Matrix

| Test ID | Module | Title / Description | Pre-conditions | Expected Result | Pass Criteria |
|---|---|---|---|---|---|
| **TC-AUTH-01** | Auth | Register new user account | Landing page loaded | Account created in `pending` status | User cannot access dashboard until approved |
| **TC-AUTH-02** | Auth | Reject duplicate email registration | Existing user in DB | Error alert displayed: email already registered | No duplicate records created |
| **TC-AUTH-03** | Auth | Blocked user sign-in attempt | User status = `blocked` | Sign-in rejected with error alert | Session not established, stays on landing |
| **TC-AUTH-04** | Auth | Password reset token request | Valid user email | Token generated and modal displays instructions | Token allows password update once |
| **TC-AUTH-05** | Auth | Token expiration & reuse guard | Expired or used token | Token rejected with invalid/expired error | Password remains unchanged |
| **TC-UM-01** | User Mgmt | Superadmin approves pending user | User in pending state | Status transitions from pending to active | Approved user can log in immediately |
| **TC-UM-02** | User Mgmt | Admin visibility restriction | Logged in as Admin | Superadmin accounts hidden from table/edit | Admin cannot edit or see Superadmins |
| **TC-UM-03** | User Mgmt | Last Superadmin protection guard | Exactly 1 Superadmin in system | Block/delete/demote button disabled/rejected | Prevents organizational lockout |
| **TC-PERM-01** | RBAC | 36-Action Rights assignment | Logged in as Superadmin | Checking/unchecking rights persists to user store | User's UI and actions reflect assigned rights |
| **TC-PERM-02** | RBAC | All / None module group toggles | Rights modal open | Toggling group checkbox toggles all child rights | Batch permission updates function correctly |
| **TC-DB-01** | Database | Base tables integrity & constraints | PostgreSQL schema | Tables `customer`, `product`, `employee`, `job`, `dept` exist | FK relationships and active flags operational |
| **TC-UI-01** | Design System | Button hierarchy and hover scaling | Dark theme active | Hover transitions smooth at 1.08 scale | Zero toolbar jitter or element displacement |


---

## 3. Environment Testing Procedures & Defect Verification Log

### 3.1 Dual-Mode Environment Setup
- **Supabase Cloud Mode:** Verify that `SUPABASE_CONFIG` connects to the live project and database requests succeed with valid response payloads.
- **Offline / Local Mode:** Simulate network disconnect or empty credentials. The topbar badge must display `○ Local Storage (Offline Mode)` and pre-seeded mock records must load without unhandled exceptions.

### 3.2 Pre-Release Defect Verification (Sprint 1 Week 1)

| Defect ID | Component | Description | Status | Verification Reference |
|---|---|---|---|---|
| **DEF-01** | UI / Styles | Button hover scale factor was set to 1.15, causing slight text blur and layout jitter on compact action rows. | **VERIFIED FIXED** | Resolved in PR #9 (`scale(1.08)`). Smooth transition verified. |
| **DEF-02** | UI / Accessibility | Alert info background opacity was 0.05, resulting in borderline contrast on dark backgrounds. | **VERIFIED FIXED** | Resolved in PR #9 (`rgba(56, 139, 253, 0.1)`). Contrast verified. |
| **DEF-03** | Database / Schema | Customer `payterms` constraint omitted Net terms (`Net 30`, `Net 45`, `Net 60`), and `creditlimit` lacked default. | **VERIFIED FIXED** | Resolved in PR #10. Seed data imports and constraint checks verified. |

---

## 4. Quality Sign-Off Criteria

To achieve Quality Sign-Off for Sprint 1:
- [ ] 100% of P1 test cases (Authentication & Access Control) must pass.
- [ ] Zero blocking or high-severity visual defects in core screens.
- [ ] All database migrations must execute without syntax errors or constraint violations in the Supabase SQL editor.
