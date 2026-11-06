# Erp_ABRAKADABRAHAM

The application currently stores its demo data in browser local storage. Supabase client configuration and an initial security-schema migration are in place, but authentication and ERP module data have not yet been migrated. See [the Supabase setup guide](docs/supabase_setup.md).

## Project structure

- `index.html` — single-page entry point containing the landing/login view, dashboard shell, and shared modals. Keeping the markup here allows the app to run directly from a `file://` URL.
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

`src/` contains the application source. `index.html` remains at the repository root as the entry point, so the app still works directly from a `file://` URL. JavaScript files are loaded in dependency order at the end of `index.html`. Keep the page markup there unless the app adopts a local web server or build step that can load separate HTML fragments.
