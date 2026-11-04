# Hope, Inc. ERP — High-Fidelity Mockups & Developer Handoff Notes

**Sprint:** Sprint 1 (Week 2)  
**Task ID:** `S1-UIX-04` (Row 21 in Chronological Task Plan)  
**Role:** UI/UX Designer — Clark Jarred Deocampo (`clarkjarreddeocampo`)  
**Design Theme:** GitHub Primer Dark  
**Status:** Approved for Implementation  

---

## 1. Overview & Handoff Objectives

This specification delivers production-grade high-fidelity architectural wireframes, component interaction states, and design token standards for all foundational Sprint 1 screens. Developers must follow these layout matrices when implementing client-side views and API controllers.

---

## 2. Screen Specifications: Landing & Authentication Views

### 2.1 Screen 1: Split-Panel Landing & Login View (`#landing`)

```
+-----------------------------------------------------------------------------------------+
|                                                          [ Status: ● Supabase Cloud ]   |
+--------------------------------------------+--------------------------------------------+
| [Left Showcase Panel]                      | [Right Auth Card Panel]                    |
|                                            |                                            |
| [Logo] Hope, Inc. ERP                      | +----------------------------------------+ |
|                                            | | Log into Hope, Inc. ERP                | |
| Explore what's inside                      | |                                        | |
| Comprehensive modular enterprise tools...  | | [Alert: Invalid credentials          ] | |
|                                            | |                                        | |
| +----------------------------------------+ | | [ Email Address                      ] | |
| | [Icon] Customer Management             | | | [ Password                     (eye) ] | |
| | Complete client profiles & credit lines| | |                                        | |
| +----------------------------------------+ | | [ Log in (Primary Green)             ] | |
| +----------------------------------------+ | |                                        | |
| | [Icon] Product Management              | | | [x] Remember me      Forgot password?  | |
| | Central inventory & effective pricing  | | |                                        | |
| +----------------------------------------+ | | ---------------- or ----------------- | |
| +----------------------------------------+ | |                                        | |
| | [Icon] Human Resources                 | | | [ G  Continue with Google          ] | |
| | Personnel directories & promotion logs | | |                                        | |
| +----------------------------------------+ | | [ Create new account (Outline)       ] | |
|                                            | |                                        | |
| Where your whole business comes together.  | | [Demo Account Hint Box               ] | |
|                                            | +----------------------------------------+ |
+--------------------------------------------+--------------------------------------------+
```

### 2.2 Screen 2: User Registration Modal Dialog (`#registerModal`)

```
+-------------------------------------------------------------+
| Create your account                                     [X] |
| Join Hope, Inc. ERP                                         |
+-------------------------------------------------------------+
| [Role Note: New accounts are created as User. Admin roles   |
|  can only be assigned by existing administrators.          ] |
|                                                             |
| +----------------------------+ +--------------------------+ |
| | First name                 | | Last name                | |
| | [ John                   ] | | [ Doe                  ] | |
| +----------------------------+ +--------------------------+ |
|                                                             |
| Email address                                               |
| [ you@company.com                                         ] |
|                                                             |
| [ Register (Full Width Primary Green)                     ] |
|                                                             |
| -------------------------- or ----------------------------- |
| [ G  Continue with Google                                 ] |
|                                                             |
| Already have an account? Sign in                            |
+-------------------------------------------------------------+
```


---

## 3. Screen Specifications: Dashboard & Administrative Consoles

### 3.1 Screen 3: Dashboard Overview (`#dashboard`)

```
+-----------------------------------------------------------------------------------------+
| [Logo] Hope, Inc. ERP                                       [ Avatar: K | Kurt Abraham ]|
+-----------------------------------------------------------------------------------------+
| [Dashboard *]   Customers   Products   Human Resources   Sales   Reports                |
+-----------------------------------------------------------------------------------------+
| Page Title: Dashboard                                               [ Badge: SUPERADMIN ]|
|                                                                                         |
| +---------------------------------------------------------+ +-------------------------+ |
| | Welcome back, Kurt!                                     | | Quick Actions           | |
| | You have full system access across all ERP modules.     | |                         | |
| +---------------------------------------------------------+ | Navigate modules using  | |
|                                                             | the top underline nav.  | |
| +----------------+ +----------------+ +-----------------+   |                         | |
| | Total Cust.    | | Total Prod.    | | Sales Txns      |   | [ Sign out            ] | |
| | 12             | | 24             | | 48              |   +-------------------------+ |
| | 2 inactive     | | 1 inactive     | | 0 inactive      |                               |
| +----------------+ +----------------+ +-----------------+                               |
+-----------------------------------------------------------------------------------------+
```

### 3.2 Screen 4: User Management Console Table (`#userModule`)

```
+-----------------------------------------------------------------------------------------+
| [All (5)]   Active (4)   Pending (1)   Blocked (0)                    [ + Add New User ]|
|                                                                                         |
| [ Search users by name or email...                      ]                               |
|                                                                                         |
| +-------------------------------------------------------------------------------------+ |
| | Name             | Email               | Role       | Status    | Rights | Actions  | |
| +------------------+---------------------+------------+-----------+--------+----------+ |
| | Kurt Abraham     | superadmin@hope.com | Superadmin | Active    | Full   | (Hidden) | |
| | Tristan Bacani   | ceo@hope.com        | Superadmin | Active    | Full   | (Hidden) | |
| | Mischa Solis     | admin@hope.com      | Admin      | Active    | Full   | Edit/Blk | |
| | Clark Deocampo   | manager@hope.com    | Admin      | Active    | Full   | Edit/Blk | |
| | Simon Mangubat   | user@hope.com       | User       | Active    | Custom | Rights   | |
| | John Doe (New)   | jdoe@company.com    | User       | Pending   | None   | Approve  | |
| +-------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

### 3.3 Screen 5: 41-Action Rights Matrix Dialog (`#rightsModal`)

```
+-----------------------------------------------------------------------------------------+
| Permissions for Simon Mangubat (user@hope.com)                                      [X] |
| Configure granular operational rights across ERP modules                                |
+-----------------------------------------------------------------------------------------+
| +-------------------------------------------------------------------------------------+ |
| | [x] Customer Management                             [ Select All ]   [ Select None] | |
| |     [x] Add Customer                           [x] Edit Customer                    | |
| |     [ ] Delete Customer                                                             | |
| +-------------------------------------------------------------------------------------+ |
| +-------------------------------------------------------------------------------------+ |
| | [x] Product Management                              [ Select All ]   [ Select None] | |
| |     [x] Add Product                            [x] Edit Product                     | |
| |     [ ] Delete Product                         [ ] Add Price                        | |
| |     [ ] Edit Price                             [ ] Delete Price                     | |
| +-------------------------------------------------------------------------------------+ |
| +-------------------------------------------------------------------------------------+ |
| | [ ] Human Resources                                 [ Select All ]   [ Select None] | |
| |     [ ] Add Department                         [ ] Edit Department                  | |
| |     [ ] Add Employee                           [ ] Edit Employee                    | |
| +-------------------------------------------------------------------------------------+ |
|                                                 [ Cancel ]   [ Save Permissions (Grn) ] |
+-----------------------------------------------------------------------------------------+
```
