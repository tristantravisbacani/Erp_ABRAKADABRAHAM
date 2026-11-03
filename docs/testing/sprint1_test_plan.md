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
