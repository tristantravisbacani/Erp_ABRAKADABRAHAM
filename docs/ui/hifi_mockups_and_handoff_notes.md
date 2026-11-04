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
