# Erp_ABRAKADABRAHAM

The application currently stores its demo data in browser local storage. Backend integrations will be rebuilt separately.

## Project structure

- `index.html` — single-page entry point containing the landing/login view, dashboard shell, and shared modals. Keeping the markup here allows the app to run directly from a `file://` URL.
- `css/base.css` — shared design tokens and common UI styles.
- `css/pages/` — landing page and dashboard shell styles.
- `css/components/` — shared component styles, including modals.
- `css/modules/` — styles for implemented ERP modules.
- `js/core.js` — shared helpers, permissions, local user storage, and modal controls.
- `js/features/` — authentication, dashboard, navigation, and password-reset flows.
- `js/modules/` — implemented ERP module logic. User Management is currently the only implemented module here; Customers, Products, HR, Sales, and Reports remain placeholders.
- `docs/` — project agreements, test plans, and UI specifications.

JavaScript files are loaded in dependency order at the end of `index.html`. Keep the page markup in that file unless the app adopts a local web server or build step that can load separate HTML fragments.
