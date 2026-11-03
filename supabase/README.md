# Supabase Database Guide (No Docker Required)

**Role:** DB Admin  
**Owner:** Mischa Andrei Sir Solis  
**Project:** Hope, Inc. ERP  

This guide provides instructions for connecting our local ERP web application to our shared Supabase PostgreSQL cloud database, running database migrations, and handling offline scenarios without needing Docker or local database engines.

---

## 1. Cloud Project Setup (One-Time by DBA)

1. Navigate to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and configure:
   - **Name:** `hope-erp`
   - **Database Password:** Store securely (do not commit to GitHub).
   - **Region:** Southeast Asia (Singapore) or nearest to team.
3. Once provisioned, open **Settings → API**:
   - **Project URL:** `https://<project-ref>.supabase.co`
   - **Project API Keys:** Copy the `anon` / `public` key.

---

## 2. Team Member Setup (Connecting the Website)

1. Duplicate `supabase/config.example.js` to `supabase/config.js` (or configure in `js/supabase.js`):
   ```javascript
   const SUPABASE_CONFIG = {
     url: 'https://your-project-ref.supabase.co',
     anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   };
   ```
2. The website frontend automatically detects if valid keys are provided.
   - **Connected:** The status badge displays `● Supabase Cloud (Live)`.
   - **Disconnected / Paused / Offline:** The application automatically falls back to pre-seeded local storage without crashing.

---

## 3. Running SQL Migrations (Web SQL Editor Runner)

All database tables, constraints, functions, and seed data are maintained under `supabase/migrations/` and `supabase/schema.sql`.

To run a migration:
1. Go to your Supabase Project Dashboard → **SQL Editor** (left sidebar).
2. Click **New Query**.
3. Copy the contents of the target migration file (e.g. `supabase/migrations/01_base_tables.sql`).
4. Click **Run** (or `Ctrl + Enter`).
5. Verify created tables in the **Table Editor**.

---

## 4. Free-Tier Auto-Pause & Offline Resilience

> ⚠️ **Important Demo Reminder:**  
> Supabase free projects pause automatically after **7 days of inactivity**.
> 
> - **Before any demo or class evaluation:** Log in to [app.supabase.com](https://app.supabase.com), find `hope-erp`, and click **Restore**. Restoration typically takes 1 to 2 minutes.
> - **Offline Protection:** If the project is paused or internet access fails during a presentation, the hybrid client automatically activates local storage mode so all forms, tables, and actions continue to work seamlessly.
