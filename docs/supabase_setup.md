# Supabase setup

## Current implementation status

The browser Supabase client is configured with the project URL and publishable key. Authentication and user administration use Supabase Auth and Postgres. The Customers, Products, and Price History integration is implemented in this branch and requires the new catalog migration below before it can be used; it has not yet been applied to the configured project. Human Resources and Sales records remain localStorage-backed pending later migration phases. The five demo Auth users and sandbox profiles are provisioned; the app deliberately does not send password-reset requests for those shared accounts.

The publishable key is intended for browser use. Never put the Supabase secret key or a service-role key in frontend code, repository files, or demo notes. `.env` is ignored by Git.

## Apply database migrations

1. In the Supabase Dashboard, open **SQL Editor** for the project.
2. For the already-configured project, run only [`../supabase/migrations/20261107000000_customer_product_data.sql`](../supabase/migrations/20261107000000_customer_product_data.sql); the first two migrations have already been applied. For a fresh project, apply [`../supabase/migrations/20261106190000_create_security_foundation.sql`](../supabase/migrations/20261106190000_create_security_foundation.sql), [`../supabase/migrations/20261106193000_manage_users_securely.sql`](../supabase/migrations/20261106193000_manage_users_securely.sql), and the catalog migration, in timestamp order.
3. Confirm that `profiles`, `user_permissions`, `audit_log`, `erp_customers`, `erp_products`, and `erp_product_prices` exist and that RLS is enabled on all six.

New Supabase Auth users receive a profile with the `user` role, `pending` status, and `production` scope. The trigger does not trust role or scope values supplied as sign-up metadata. Users can read their own profile and permissions. Active admins can read and manage regular-user profiles; only superadmins can assign administrator roles. User administration writes go through a security-definer RPC with checks for administrator status, protected demo accounts, valid permissions, self-demotion, and the last active superadmin. ERP catalog rows are separated by the profile's `access_scope`; RLS checks that scope and the relevant module/report permission. Database triggers enforce operation-specific rights and prevent hard deletes.

## Provision the public demo accounts

These are public demo credentials and must only be used with non-sensitive sandbox data:

**Shared demo password:** `HopeDemo-ERP-7gK2mQ!`

This password is intentionally public for professor/demo access. Never reuse it for a personal or production account.

| Email | Demo role |
|---|---|
| `ceo@hope.com` | Superadmin |
| `superadmin@hope.com` | Superadmin |
| `admin@hope.com` | Admin |
| `manager@hope.com` | Admin |
| `user@hope.com` | User |

The configured project already has these users, created in **Authentication → Users** with the shared demo password and auto-confirmed for testing. To provision a fresh project, create each user in the Dashboard with the shared demo password above and auto-confirm the email address. Do not reuse a real account password. After all five users exist and the migration has run, execute [`../supabase/seed/demo_profiles.sql`](../supabase/seed/demo_profiles.sql) in the SQL Editor. It sets their demo names and roles, activates the profiles, and assigns them the `sandbox` scope. It also gives `user@hope.com` the same 11 sample permissions as the local demo account.

Do not grant these accounts access to production records. All Supabase ERP tables must enforce RLS against the profile's `access_scope` and permissions before any non-demo records are added.

The first active sandbox Admin or Superadmin sign-in seeds the Customers, Products, and Price History tables from the application's built-in demo fixtures if all three sandbox tables are empty. This seed is restricted to the sandbox scope and is never run for production profiles. It does not import arbitrary browser localStorage contents. Existing localStorage changes are not automatically migrated.

Customers, Products, and Price History read and write through Supabase after this migration is applied. Human Resources and Sales transactions/details remain localStorage-backed; Reports still runs in the browser over local HR/Sales data and catalog data. Do not treat those local HR/Sales records as production data or as protected by Supabase RLS.

## Auth configuration

1. In **Authentication → URL Configuration**, the current Site URL is `http://127.0.0.1:8765` for local testing, and the Redirect URLs allow list includes `http://127.0.0.1:8765/**` and `http://localhost:8765/**`. Password confirmation, password-reset, and OAuth redirects return to the current page URL. Before deployment, change the Site URL to the deployed app origin and add its redirect URL; no deployed origin is configured yet.
2. Keep email confirmations enabled for public signups. Email sign-in is enabled and confirmation is currently required. New signups receive only the default `user` role and `pending` account status; the profile trigger ignores role/status data submitted by the browser.
3. Configure Google OAuth under **Authentication → Sign In / Providers** and the Google Cloud OAuth client before enabling that sign-in option in a deployed app.
4. New accounts register from the public signup form and are listed as pending in **User Management**. Approve only after verifying the account. Existing accounts can be blocked/unblocked or disapproved there, and User permissions can be changed through the Rights dialog. Auth account creation/invitations are not available in the admin UI; do not create accounts by writing to `profiles`, because an Auth user is also required.
5. Serve the repository through a local HTTP server for Auth testing and ensure that origin is in the redirect allow list. Opening the page with `file://` is not supported. The app skips password-reset requests for the five shared demo accounts; requests for other account emails use Supabase Auth. Custom SMTP is currently disabled in the project, so configure a production email provider before relying on recovery emails for real users.

The login screen lists the shared demo-only password because it is public by design. Do not reuse it for real accounts. Demo accounts should only be used to demonstrate non-sensitive sandbox data.
