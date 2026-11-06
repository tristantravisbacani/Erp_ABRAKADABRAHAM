# Hope, Inc. ERP — Dashboard Header & Navigation Design Specification

**Document Version:** 1.0.0  
**Task ID:** `S1-UIX-03`  
**Role:** UI/UX Designer — Clark Jarred Deocampo (`clarkjarreddeocampo`)  
**Design Theme:** GitHub Primer Dark  

---

## 1. Overview & Structural Hierarchy

The Hope, Inc. ERP application uses a repository-inspired header and navigation layout modeled after GitHub Primer Dark. The layout is optimized for dense enterprise workflows while maintaining clear visual hierarchy across all viewports.

```
+-----------------------------------------------------------------------------------------+
| [Logo] Hope, Inc. ERP                      [Local Storage]    [User Avatar | Kurt v]    | <- .gh-top
+-----------------------------------------------------------------------------------------+
|  Dashboard   Customers   Products   HR   Sales   Reports   [Admin Menu v]              | <- .sidebar-nav
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  Page Title (e.g., "Dashboard")   [ROLE BADGE: Superadmin]                              | <- .page-head
|                                                                                         |
|  +---------------------------------------------+  +----------------------------------+  |
|  | Welcome Banner                              |  | Quick Actions / Side Panel       |  |
|  +---------------------------------------------+  +----------------------------------+  |
|  | Stats Grid (4 columns)                      |  | System Health & Activity         |  |
|  +---------------------------------------------+  +----------------------------------+  |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Navigation Architecture & Role-Based Visibility

Navigation tabs are dynamically populated by `renderSidebar()` according to the active user's assigned role and granular module view permissions:

| Tab ID | Module Name | Required Permission | Allowed Roles | Icon |
|---|---|---|---|:---:|
| `dashboard` | Dashboard Overview | None (Default landing) | `superadmin`, `admin`, `user` | 📊 |
| `customers` | Customer Management | `customers.view` | `superadmin`, `admin`, `user` (with permission) | 👥 |
| `products` | Product Catalog | `products.view` | `superadmin`, `admin`, `user` (with permission) | 📦 |
| `hr` | Human Resources | `hr.view` | `superadmin`, `admin`, `user` (with permission) | 🏢 |
| `sales` | Sales & Invoicing | `sales.view` | `superadmin`, `admin`, `user` (with permission) | 💼 |
| `reports` | Reports & Analytics | `reports.view` | `superadmin`, `admin`, `user` (with permission) | 📑 |
| `users` | User Management | `admin` role or `superadmin` | `superadmin`, `admin` | ⚙️ |

### Tab States & Indicators
- **Default:** Transparent background, `var(--text)` color, 6px padding.
- **Hover:** `rgba(177, 186, 196, 0.12)` subtle highlight with 0.1s ease transition.
- **Active:** Bold font weight (`600`) with a bottom highlight bar (`height: 2px`, `background: var(--tab)` `#f78166`).
- **Disabled:** 40% opacity with `not-allowed` cursor for unauthorized modules.

---

## 3. User Profile Pill & Dropdown Menu

Positioned in the upper-right corner of `.gh-top`:

1. **Avatar Circle:** 24x24px rounded badge with user initial, colored by role (`--primary-dark` for superadmin/admin).
2. **User Details Pill:** Compact label showing First Name + Last Name and subtle Role indicator.
3. **Dropdown Panel:**
   - Appears on hover/focus (`position: absolute; right: 0; top: 100%`).
   - Contains navigation items:
     - Profile settings
     - User Management console (visible only to `admin` / `superadmin`)
     - Divider line
     - Sign out action (`handleLogout()`)

---

## 4. Color Tokens & Visual Standards

| Element | CSS Variable / Token | Hex Value | Purpose |
|---|---|---|---|
| Background | `--bg` | `#0d1117` | Canvas root background |
| Header Bar | `--header` | `#010409` | High-contrast topbar |
| Surface / Cards | `--surface` | `#0d1117` | Stat cards and panels |
| Elevated Subtle | `--subtle` | `#151b23` | Dropdowns, table headers |
| Tab Active Bar | `--tab` | `#f78166` | GitHub orange active indicator |
| Role: Superadmin | Badge token | `#f78166` | Critical governance indicator |
| Role: Admin | Badge token | `#ab7df8` | Elevated administrative rights |
| Role: User | Badge token | `#4493f8` | Standard operational privileges |

---

## 5. Responsive Behavior & Breakpoints

- **Desktop (> 960px):** Full horizontal underline tab navigation, 4-column stats grid, 2-column dashboard layout (main content + side panel).
- **Tablet (768px – 960px):** Navigation bar scrollable horizontally with hidden scrollbars; dashboard grid collapses to single column.
- **Mobile (< 768px):** User details text hidden (avatar icon retained); stats grid collapses to 2x2 layout.
