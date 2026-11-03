# Branch Protection & Repository Guidelines

**Project:** Hope, Inc. ERP System  
**Owner:** Team ABRAKADABRAHAM  
**Scrum Master:** Tristan Travis Bacani  

---

## 🔒 Branch Protection Rules for `main`

To satisfy our team's **Definition of Done** and grading criteria, the following branch protection guidelines apply to the `main` branch:

1. **Require Pull Request Before Merging:**
   - Direct pushes to `main` are restricted.
   - All code, database schemas, and documentation changes must arrive via a feature branch (`feat/`, `fix/`, `docs/`, `setup/`) through a GitHub Pull Request.

2. **Require Approvals:**
   - At least 1 approved review from a team member is required before merging.
   - Peer reviews award **0.5 PR credit** (up to 4 reviews = max 2 PR equivalents) towards each reviewer's grade.

3. **Branch Naming Conventions:**
   - Setup / Config: `setup/s<sprint>-<role>-<task#>-<name>` (e.g., `setup/s1-sm-01-repo-templates`)
   - Features: `feat/s<sprint>-<role>-<task#>-<name>` (e.g., `feat/s1-dev-01-app-scaffold`)
   - Database / Migrations: `db/s<sprint>-<role>-<task#>-<name>` (e.g., `db/s1-dba-01-supabase-setup`)
   - Testing: `test/s<sprint>-<role>-<task#>-<name>` (e.g., `test/s1-tst-01-sprint1-test-plan`)
   - UI / Design: `ui/s<sprint>-<role>-<task#>-<name>` (e.g., `ui/s1-uix-01-design-system`)

4. **PR Titles:**
   - Format: `[<TASK-ID>] <Title>` (e.g., `[S1-SM-01] Repo setup: branch protection, PR and issue templates`)
