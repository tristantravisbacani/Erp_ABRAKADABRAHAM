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
