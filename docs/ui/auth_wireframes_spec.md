# UI/UX Specification: Authentication & Landing Layout

**Project:** Hope, Inc. ERP Web Application  
**Task:** S1-UIX-02 (Wireframes: login, register, set/reset password)  
**Lead Designer:** Clark Jarred Deocampo  
**Design System:** GitHub Primer Dark  

---

## 1. Overview & Layout Strategy

The authentication portal uses an asymmetrical two-column desktop grid that collapses gracefully to a clean mobile single-column layout.

```
+------------------------------------------+-----------------------+
|                AUTH LEFT                 |      AUTH RIGHT       |
|  - Brand (Logo + Hope, Inc. ERP)         |                       |
|  - Floating Accent Badges & Chips        |  - Login Form Card    |
|  - Live Dashboard Component Preview      |  - Google OAuth Btn   |
|  - "Where your whole business comes      |  - Register Modal CTA |
|    together" Gradient Headline           |  - Demo Credentials   |
+------------------------------------------+-----------------------+
```

---

## 2. Component Specifications

### 2.1 Hero Preview Panel (`.auth-left`)
- **Background:** Primer Dark (`#0d1117`) overlaid with a subtle radial gradient (`rgba(68, 147, 248, 0.12)`).
- **Dashboard Preview Widget:** Miniature preview card representing the 4 core business modules:
  - Customers (`👥`)
  - Products (`📦`)
  - Human Resources (`🧑‍💼`)
  - Sales (`📈`)
- **Floating Accent Chips:** Pill tags highlighting key architectural values:
  - `Role-based access` (Shield icon)
  - `Every change stamped` (Clock audit icon)
- **Headline Typography:** `clamp(2.4rem, 4.2vw, 3.6rem)` with gradient text highlight (`#ab7df8` to `#4493f8`).

### 2.2 Auth Form Card (`.auth-right`)
- **Card Width:** Max 440px, centered horizontally and vertically.
- **Form Inputs:** Rounded pill fields (height: 52px, border-radius: 14px), 1px border (`#3d444d`), active focus border with primary inset ring (`#4493f8`).
- **Password Input:** Suffix icon button for password visibility toggling (`👁` / `🙈`).
- **Primary CTA:** 52px full-width button styled in GitHub green (`#238636` to `#2ea043` hover).
- **Secondary CTA:** Outlined link button triggering the Registration Modal.

---

## 3. Modal Dialog Wireframes

### 3.1 Registration Modal (`registerModal`)
- **Header:** "Create your account" — "Join Hope, Inc. ERP"
- **Body Fields:**
  - Row 1: First Name (text), Last Name (text)
  - Row 2: Email address (email)
- **Role Policy Notice:** Displays info box: *"New accounts are created as User. Superadmin and Admin roles can only be assigned by existing administrators."*
- **Action Buttons:** "Register" (Primary), "Continue with Google" (OAuth), switch link to Sign In.

### 3.2 Reset Password Modal (`resetModal`)
- **Header:** "Reset password" — "We'll send you a secure link to reset it"
- **Body Fields:** Email address (email)
- **Action Buttons:** "Send Reset Link" (Primary), switch link back to Sign In.

---

## 4. Responsive Viewports & Accessibility
- **Desktop (> 960px):** Full split-screen grid (`1.25fr 1fr`).
- **Tablet / Mobile (≤ 960px):** Single-column stack. Left visual preview is hidden to prioritize fast mobile authentication without unnecessary scrolling.
- **Accessibility:**
  - Contrast ratios meet WCAG AA standards.
  - Visible focus indicators (`outline: 2px solid var(--primary)`) on all interactive inputs and buttons.
