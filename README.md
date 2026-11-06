# Erp_ABRAKADABRAHAM

The application uses Supabase for authentication, user administration, and scoped Customers, Products, and Price History data. Human Resources and Sales records remain browser-local while later migration phases are completed. See [the Supabase setup guide](docs/supabase_setup.md).

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
- `src/js/modules/` — implemented ERP module logic. User Management uses Supabase for authenticated sessions. Customers, Products, and Price History use scoped Supabase storage for authenticated sessions and retain localStorage in local/demo mode. HR, Sales, and Reports remain localStorage-backed pending later migration phases.
- `docs/` — project agreements, test plans, and UI specifications.

`src/` contains the application source. `index.html` remains at the repository root as the entry point, with JavaScript files loaded in dependency order. A `file://` URL can display the local-only UI, but Supabase Auth requires serving the app over HTTP; see [the Supabase setup guide](docs/supabase_setup.md).
