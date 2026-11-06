# Supabase setup

## Current implementation status

The browser Supabase client is configured with the project URL and publishable key. The initial migration has been applied to the configured project, and the five demo Auth users and sandbox profiles have been provisioned. Email/password login, session restore, sign-out, signup, password-reset, and Google OAuth flows use Supabase Auth. ERP module data and user administration are still localStorage-backed.

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

The configured project already has these users, created in **Authentication → Users** with the shared demo password and auto-confirmed for testing. To provision a fresh project, create each user in the Dashboard with the shared demo password above and auto-confirm the email address. Do not reuse a real account password. After all five users exist and the migration has run, execute [`../supabase/seed/demo_profiles.sql`](../supabase/seed/demo_profiles.sql) in the SQL Editor. It sets their demo names and roles, activates the profiles, and assigns them the `sandbox` scope. It also gives `user@hope.com` the same 11 sample permissions as the local demo account.

Do not grant these accounts access to production records. The ERP module tables and their RLS policies are not part of this initial migration; add them before migrating module data, with policies that enforce both permissions and the profile's `access_scope`. Until those tables and policies exist, Supabase Auth only authenticates app users; it does not make localStorage data cloud-backed or make client-side role checks a security boundary.

## Auth configuration

1. In **Authentication → URL Configuration**, set the Site URL to the deployed app origin and add each development/deployment origin to the Redirect URLs allow list. Password confirmation, password-reset, and OAuth redirects return to the current page URL.
2. Keep email confirmations enabled for public signups. New signups receive only the default `user` role and `pending` account status; the profile trigger ignores role/status data submitted by the browser.
3. Configure Google OAuth under **Authentication → Sign In / Providers** and the Google Cloud OAuth client before enabling that sign-in option in a deployed app.
4. Until the user-management UI is migrated, approve a legitimate signup from the SQL Editor only after verifying the account. For example:

   ```sql
   update public.profiles
   set account_status = 'active'
   where lower(email) = lower('verified-person@example.com')
     and role = 'user'
     and account_status = 'pending';
   ```

   Do not use the example email literally. This manual approval step only changes the profile status; profile role and permission changes must remain admin-controlled.
5. Serve the repository through a local HTTP server for Auth testing and add that exact origin to the redirect allow list. Opening the page with `file://` is not supported.

The login screen lists the shared demo-only password because it is public by design. Do not reuse it for real accounts. Demo accounts should only be used to demonstrate non-sensitive sandbox data.
