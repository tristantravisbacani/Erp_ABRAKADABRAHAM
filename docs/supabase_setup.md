# Supabase setup

## Current implementation status

The browser Supabase client is configured with the project URL and publishable key. The initial migration creates protected profile, permission, and audit tables. The current login, registration, password-reset, and ERP modules still use the existing local demo implementation; they do not yet read or write Supabase data.

The publishable key is intended for browser use. Never put the Supabase secret key or a service-role key in frontend code, repository files, or demo notes. `.env` is ignored by Git.

## Apply the initial migration

1. In the Supabase Dashboard, open **SQL Editor** for the project.
2. Run [`../supabase/migrations/20261106190000_create_security_foundation.sql`](../supabase/migrations/20261106190000_create_security_foundation.sql).
3. Confirm that `profiles`, `user_permissions`, and `audit_log` exist and that RLS is enabled on all three.

New Supabase Auth users receive a profile with the `user` role, `pending` status, and `production` scope. The trigger does not trust role or scope values supplied as sign-up metadata. Client users can read their own profile and permissions but cannot change roles, statuses, permissions, or audit records.

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

Create each user in **Authentication → Users** in the Supabase Dashboard with the shared demo password above and confirm the email address. Do not reuse a real account password. After all five users exist and the migration has run, execute [`../supabase/seed/demo_profiles.sql`](../supabase/seed/demo_profiles.sql) in the SQL Editor. It activates these five profiles and assigns them the `sandbox` scope.

Do not grant these accounts access to production records. The ERP module tables and their RLS policies are not part of this initial migration; add them before migrating module data, with policies that enforce both permissions and the profile's `access_scope`.

## Browser loading

The page loads Supabase JS v2 from jsDelivr and initializes `window.supabaseClient` using the publishable key. The current login screen still uses the local demo flow and accepts any password; the shared Supabase demo password above will not be used by the app until the Supabase Auth integration is implemented. For local testing, serve the repository through a local HTTP server and add that origin to the Supabase project's allowed Auth redirect URLs when Auth flows are introduced. Opening the page directly with `file://` is not a supported cloud-auth test.
