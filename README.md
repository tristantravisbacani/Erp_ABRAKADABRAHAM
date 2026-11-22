# Hope, Inc. ERP 🏢

**A role-based web ERP for customers, products, HR, sales and reports, built on Supabase.**

Hope, Inc. ERP (repo: `Erp_ABRAKADABRAHAM`) is a single-page web application for running a small company's day-to-day records. It covers customer and product catalogs with price history, human resources, sales and payments, and printable reports. Access is controlled by roles and fine-grained permissions that are enforced in the database, not just in the browser.

It was built by **Team ABRAKADABRAHAM** as an Agile (Scrum) course project. All business data in the Production scope is fictional sample data.

<img width="1064" height="848" alt="image" src="https://github.com/user-attachments/assets/6d0770fd-78e6-4e1a-b843-d25ee26975c9" />


## Requirements

- A modern browser (current Chrome, Edge, Firefox or Safari)
- An internet connection to reach Supabase
- To run it yourself:
  - Any static file server (the app has no build step)
  - *Opening `index.html` with a `file://` URL shows the UI, but Supabase sign-in does not work that way. Serve it over HTTP.*
  - A Supabase project if you want your own backend, see [docs/supabase_setup.md](docs/supabase_setup.md)

## Usage Instructions

### Try it with a demo account

1. Open the app and use one of the demo accounts on the login screen.
2. The shared demo password is shown on the login screen and in [docs/supabase_setup.md](docs/supabase_setup.md).
3. Demo accounts use the **sandbox** data scope, so nothing you change touches Production records.

| Email | Role |
|---|---|
| `ceo@hope.com`, `superadmin@hope.com` | Superadmin |
| `admin@hope.com`, `manager@hope.com` | Admin |
| `user@hope.com` | User (limited sample permissions) |

### Create your own account

1. Choose **Create new account**, or **Continue with Google**.
2. Confirm your email if asked.
3. Wait for an administrator to approve your account in **User Management**. New accounts start as `pending` with no module access.

### Run it locally

1. Clone the repository:
   ```bash
   git clone https://github.com/tristantravisbacani/Erp_ABRAKADABRAHAM.git
   cd Erp_ABRAKADABRAHAM
   ```
2. Serve the folder over HTTP, for example:
   ```bash
   python -m http.server 8765
   ```
3. Open `http://127.0.0.1:8765`.
   - *Add this origin to your Supabase project's redirect URL allow list so sign-in, confirmation and password-reset links return to the app.*

### Use your own Supabase project

1. Create a Supabase project.
2. Apply the migrations in `supabase/migrations/` in timestamp order. The last one is a guarded Production sample-data import, so only run it on an empty Production scope.
3. Create the five demo Auth users, then run `supabase/seed/demo_profiles.sql`.
4. Put your project URL and **publishable** key in `src/js/supabase.js`.
   - *Never put a secret or service-role key in this repository or in frontend code.*
5. Follow the full walkthrough in [docs/supabase_setup.md](docs/supabase_setup.md), including Auth and Google sign-in configuration.

## Current Features

### 🔐 Authentication & User Management
- Email and password sign-up and login, plus Google sign-in
- Approval workflow: pending, active, blocked and disapproved accounts
- Three roles (Superadmin, Admin, User) and 41 individual permissions, managed from a Rights dialog
- Password reset by email link
- Safeguards in the database for self-demotion and for removing the last active Superadmin
- Live connection status badge for the cloud service

### 👥 Customers
- Add, edit and soft-delete customers, with restore for administrators
- Search plus Active and Inactive filters
- Payment terms and a record stamp on every change

### 📦 Products & Price History
- Product catalog with units of measure
- Historical prices with effective dates
- Separate permissions for adding, editing and deleting products and prices

### 🧑‍💼 Human Resources
- Employees, jobs and departments
- Job history for each employee
- Names exposed to Sales users through a restricted function, so full employee records stay behind HR access

### 💼 Sales & Payments
- Sales transactions with line items
- Price lookup as of the sale date
- Payments tab with official receipt numbers and amounts

### 📑 Reports
- Seven reports: Top Customers, Product Master List, Top Products, Active Employees, All Employees, Employee Job History and Top Sales
- Calculated in Postgres by a permission-checked function, with date range and Top N options
- Printable from the browser

### 🛡️ Data Security
- Row-level security on every ERP table
- Sandbox and Production data scopes
- Database triggers that check the right for each operation (add, edit, delete)
- Soft deletes only, with no hard-delete rights granted to app users

## Project Structure

```text
index.html                 Single-page entry point (landing, dashboard shell, modals)
src/
  css/                     Design tokens, page, component and module styles
  js/
    core.js                Helpers, permissions catalogue, modal controls
    supabase.js            Supabase client (publishable key only)
    supabase-erp-data.js   Scoped data loading for ERP modules
    features/              Auth, dashboard and navigation, password reset
    modules/               Customers, products, HR, sales, reports, user management
supabase/
  migrations/              Schema, RLS policies, functions and sample data
  seed/                    Demo profile provisioning
docs/                      Agile docs, test plans, UI specs, Supabase setup
```

## Note

This is a student project. The Production scope holds an approved fictional dataset (Hope database sample data credited to Jeremias C. Esperanza, NEU CCS), so please don't enter real personal or business information. The demo password is public on purpose and should never be reused anywhere else.

## Team

| Role | Member |
|---|---|
| Developer | Kurt Abraham |
| DB Admin | Mischa Solis |
| Tester | Simon Mangubat |
| UI/UX Designer | Clark Deocampo |
| Scrum Master | Tristan Bacani |

Team agreements, sprint backlogs, test plans and UI specs live in [`docs/`](docs).

## Feedback and Community

Found a bug or have an idea? Please open an issue using the templates in [`.github/ISSUE_TEMPLATE`](.github/ISSUE_TEMPLATE), and follow the [pull request template](.github/PULL_REQUEST_TEMPLATE.md) and the [working agreement](docs/agile/working_agreement.md) when contributing.

## TODO

- Deploy to a public HTTPS origin and update the Supabase Site URL and redirect list
- Publish the Google OAuth consent app (needs a public homepage and privacy policy)
- Configure a production email provider (custom SMTP is currently off)
- Add automated tests and a CI workflow
- Replace the inline `onclick` handlers so a strict Content Security Policy can be used
