# Supabase setup

## Current implementation status

The browser Supabase client is configured with the project URL and publishable key. The security foundation and user-administration migrations are applied to the configured project, and the five demo Auth users and sandbox profiles are provisioned. Email/password login, session restore, sign-out, signup, password-reset for real accounts, Google OAuth, user approval, profile role/status changes, and module-permission assignment use Supabase Auth and Postgres. The app deliberately does not send reset requests for the five shared demo accounts; their public shared password remains unchanged. ERP module records are still localStorage-backed.

The publishable key is intended for browser use. Never put the Supabase secret key or a service-role key in frontend code, repository files, or demo notes. `.env` is ignored by Git.

## Apply database migrations

1. In the Supabase Dashboard, open **SQL Editor** for the project.
2. Apply [`../supabase/migrations/20261106190000_create_security_foundation.sql`](../supabase/migrations/20261106190000_create_security_foundation.sql), then [`../supabase/migrations/20261106193000_manage_users_securely.sql`](../supabase/migrations/20261106193000_manage_users_securely.sql), in timestamp order.
3. Confirm that `profiles`, `user_permissions`, and `audit_log` exist and that RLS is enabled on all three.

New Supabase Auth users receive a profile with the `user` role, `pending` status, and `production` scope. The trigger does not trust role or scope values supplied as sign-up metadata. Users can read their own profile and permissions. Active admins can read and manage regular-user profiles; only superadmins can assign administrator roles. Writes go through a security-definer RPC with checks for administrator status, protected demo accounts, valid permissions, self-demotion, and the last active superadmin. Client users cannot write profiles, permissions, or audit records directly.

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

Do not grant these accounts access to production records. User management is connected to Supabase, but ERP module records are not yet migrated. Add module tables and RLS policies before migrating those records, enforcing permissions and the profile's `access_scope`.

## Auth configuration

1. In **Authentication → URL Configuration**, the current Site URL is `http://127.0.0.1:8765` for local testing, and the Redirect URLs allow list includes `http://127.0.0.1:8765/**` and `http://localhost:8765/**`. Password confirmation, password-reset, and OAuth redirects return to the current page URL. Before deployment, change the Site URL to the deployed app origin and add its redirect URL; no deployed origin is configured yet.
2. Keep email confirmations enabled for public signups. Email sign-in is enabled and confirmation is currently required. New signups receive only the default `user` role and `pending` account status; the profile trigger ignores role/status data submitted by the browser.
3. Configure Google OAuth under **Authentication → Sign In / Providers** and the Google Cloud OAuth client before enabling that sign-in option in a deployed app.
4. New accounts register from the public signup form and are listed as pending in **User Management**. Approve only after verifying the account. Existing accounts can be blocked/unblocked or disapproved there, and User permissions can be changed through the Rights dialog. Auth account creation/invitations are not available in the admin UI; do not create accounts by writing to `profiles`, because an Auth user is also required.
5. Serve the repository through a local HTTP server for Auth testing and ensure that origin is in the redirect allow list. Opening the page with `file://` is not supported. The app skips password-reset requests for the five shared demo accounts; requests for other account emails use Supabase Auth. Custom SMTP is currently disabled in the project, so configure a production email provider before relying on recovery emails for real users.

The login screen lists the shared demo-only password because it is public by design. Do not reuse it for real accounts. Demo accounts should only be used to demonstrate non-sensitive sandbox data.
