# Erp_ABRAKADABRAHAM

The application stores ERP module demo data in browser local storage and uses Supabase for authentication, profile and permission management, and account approval. The Supabase profile/permission/audit schemas are applied; ERP module records remain local. See [the Supabase setup guide](docs/supabase_setup.md).

## Project structure

- `index.html` — single-page entry point containing the landing/login view, dashboard shell, and shared modals.
- `src/css/base.css` — shared design tokens and common UI styles.
- `src/css/pages/` — landing page and dashboard shell styles.
- `src/css/components/` — shared component styles, including modals.
- `src/css/modules/` — styles for implemented ERP modules.
- `src/js/core.js` — shared helpers, permissions, local user storage, and modal controls.
- `src/js/supabase.js` — browser Supabase client initialization using the publishable key only.
- `supabase/` — database migrations and demo-profile provisioning SQL.
- `src/js/features/` — authentication, dashboard, navigation, and password-reset flows.
- `src/js/modules/` — implemented ERP module logic. User Management is implemented; Customers includes its localStorage-backed list, search, filters, soft delete, restore, create, and edit flows; Products includes its localStorage-backed catalog, price history and management, current-price display, search, status filters, and CRUD flows; HR includes localStorage-backed employee, job, and department directories, plus employee job-history records, with permission-aware search, status filters, and record management. Sales includes the complete prototype transaction and line-item fixtures, customer and employee assignments, historical price totals, search, status filters, permission-aware CRUD, soft-delete, and restore flows, and a safe backfill for existing localStorage data. Reports includes seven permission-aware sales, product, employee, and job-history reports with date and Top N filters and print/PDF support.
- `docs/` — project agreements, test plans, and UI specifications.

`src/` contains the application source. `index.html` remains at the repository root as the entry point, with JavaScript files loaded in dependency order. A `file://` URL can display the local-only UI, but Supabase Auth requires serving the app over HTTP; see [the Supabase setup guide](docs/supabase_setup.md).
