# Sprint 1 Backlog & 8-Week ERP Module Roadmap

**Project:** Hope, Inc. ERP Web Application  
**Sprint:** 1 (Weeks 1–2)  
**Scrum Master:** Tristan Travis Bacani  

---

## 🗺️ 8-Week ERP Module-to-Sprint Roadmap

All 6 core modules from the reference guide are scheduled across 4 sprints (8 weeks):

| Sprint | Weeks | Guide Modules Covered | Key Deliverables |
|:---:|:---:|---|---|
| **Sprint 1** | Weeks 1–2 | **Authentication & User Management** | User registration, login/logout, session handling, 36-action rights catalog, superadmin approval & designation, design system foundation. |
| **Sprint 2** | Weeks 3–4 | **Customer Management & Product Catalog** | Customer CRUD with soft delete/restore, active/all filters; Product CRUD, unit/payTerms validation, historical pricing with effective dates. |
| **Sprint 3** | Weeks 5–6 | **Human Resources (HR)** | Departments & Jobs CRUD, Employee master list, employee profile, job history (promotions, transfers, salary tracking) & timeline viewer. |
| **Sprint 4** | Weeks 7–8 | **Sales & Reports** | Sales transaction header (auto-numbering), line items, price-as-of-date lookup, payments & balances, 7 printable reports, audit log viewer, full regression. |

---

## 📋 Sprint 1 User Stories & Acceptance Criteria

### Story 1: User Registration & Pending State (S1-DEV-02)
- **As a** new employee/user,
- **I want to** register with my name and email,
- **So that** I can request access to the Hope, Inc. ERP platform.
- **Acceptance Criteria:**
  - [ ] New accounts are created in `pending` status by default.
  - [ ] Duplicate email registrations are rejected with a clear error message.
  - [ ] Pending users cannot access modules until approved by a Superadmin.

### Story 2: Secure Authentication & Session Handling (S1-DEV-03, S1-DEV-04)
- **As a** registered team member,
- **I want to** sign in securely and stay logged in during my session,
- **So that** I can access my assigned ERP modules.
- **Acceptance Criteria:**
  - [ ] Blocked users receive an "Account is blocked" notification and cannot sign in.
  - [ ] First-time users or reset requests use secure tokens.
  - [ ] Current session persists in storage and populates user info in topbar.
  - [ ] Logout clears session and redirects to landing page.

### Story 3: User Management Console (S1-DEV-05, S1-DEV-06)
- **As an** Administrator or Superadmin,
- **I want to** view, add, edit, approve, and block users,
- **So that** our organization maintains tight governance over access.
- **Acceptance Criteria:**
  - [ ] Superadmins can approve or disapprove pending accounts.
  - [ ] Admins can manage standard Users, but Superadmin accounts remain hidden and protected from Admin edits.
  - [ ] System blocks deleting or unassigning the last remaining Superadmin.

### Story 4: 36-Action Rights Catalogue & Granular Permissions (S1-DEV-07)
- **As a** Superadmin or Administrator,
- **I want to** assign per-action permissions across all 5 operational modules,
- **So that** employees only access and modify data they are authorized to touch.
- **Acceptance Criteria:**
  - [ ] Rights dialog displays all 36 granular permissions grouped by module:
    - Customers (4 rights: view, add, edit, delete)
    - Products (7 rights: view, add, edit, delete, priceAdd, priceEdit, priceDelete)
    - Human Resources (14 rights: view, job/dept CRUD, emp CRUD, job history CRUD)
    - Sales (7 rights: view, add, edit, delete, line item CRUD)
    - Reports (7 rights: Top Customers, Product Master, Top Products, Active/All Employees, Job History, Top Sales)
  - [ ] Module-level checkboxes and "All/None" quick toggles function properly.
  - [ ] Every permission modification is recorded in `audit_log`.

### Story 5: Dynamic Navigation & Dashboard Shell (S1-DEV-08)
- **As an** authenticated user,
- **I want to** see sidebar navigation tabs that match my assigned permissions,
- **So that** unauthorized modules are hidden from my view.
- **Acceptance Criteria:**
  - [ ] Sidebar and quick tiles dynamically display only modules where user has `*.view` permission.
  - [ ] Direct URL or route tampering to an unauthorized module triggers an "Access Denied" state.
