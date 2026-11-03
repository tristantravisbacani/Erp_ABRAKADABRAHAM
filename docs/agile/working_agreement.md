# Team Working Agreement & Engineering Standards

**Project:** Hope, Inc. ERP Web Application  
**Team:** ABRAKADABRAHAM  
**Scrum Master:** Tristan Travis Bacani  

---

## 1. Team Working Agreement

### 1.1 Communication & Collaboration Norms
- **Primary Channels:** Team Discord / Chat for quick technical questions; GitHub Issues and Pull Requests for tracking and formal reviews.
- **Standup Cadence:** Async daily standup updates posted by 10:00 AM (What did you finish? What are you working on today? Any impediments?).
- **Transparency:** All work, database changes, and test cases must be represented as GitHub Pull Requests linked to the corresponding sprint backlog item.

### 1.2 Branching & Pull Request Protocols
- **Branch Off Main:** Always branch off an up-to-date `main` branch.
- **Branch Naming:** Clean, descriptive branch names representing the deliverable (e.g., `feat/login-flow`, `db/base-schema`, `docs/working-agreement`).
- **Commit Messages:** Clear, natural English descriptions written in imperative mood (e.g., `Add user registration modal`, `Update price lookup query`).
- **Review Turnaround:** Team members must review open PRs within 24 hours of notification to maintain velocity.
- **Peer Review Credit:** Every team member should review teammate PRs to accumulate required peer-review credits.

---

## 2. Definition of Done (DoD)

A task / PR is considered **Done** only when all of the following conditions are satisfied:

1. **Acceptance Criteria Verified:** Every acceptance criterion defined in the corresponding user story has been built and manually verified.
2. **Code & Architecture Hygiene:**
   - Code is clean, well-commented, and preserves existing comments/contracts.
   - Decoupled into appropriate files (`css/`, `js/`, `supabase/`).
   - Browser console shows zero unhandled errors or warnings.
3. **Dual-Mode Data Layer:**
   - Features work smoothly against Supabase Cloud when connected.
   - Falls back gracefully to localStorage when offline or if Supabase pauses.
4. **Peer Review & Approval:**
   - At least one teammate has performed a code review, verified criteria, and submitted an approved review.
5. **No Regressions:**
   - Existing modules and navigation flows remain intact and functional.
