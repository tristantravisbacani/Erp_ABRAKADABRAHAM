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
   - Decoupled into appropriate files (`css/`, `js/`).
   - Browser console shows zero unhandled errors or warnings.
3. **Data Layer:**
   - Demo data currently uses browser localStorage.
   - Backend integrations are rebuilt as a separate task when needed.
4. **Peer Review & Approval:**
   - At least one teammate has performed a code review, verified criteria, and submitted an approved review.
5. **No Regressions:**
   - Existing modules and navigation flows remain intact and functional.

---

## 3. Role Responsibilities Guide

| Role | Assignee | Core Responsibilities | Target PRs (Midterm / Final) |
|---|---|---|:---:|
| **Developer** | Kurt Abraham | Application architecture, JavaScript modules (`auth.js`, `customers.js`, `products.js`, `hr.js`, `sales.js`, `reports.js`, `userManagement.js`), client-side RBAC enforcement, session management. | 8 / 24 (32 total) |
| **DB Admin** | Sir Mischa Solis | Database schema, migrations, indexing, audit logging, seed data, and restore documentation. | 6 / 18 (24 total) |
| **Tester** | Simon Mangubat | Sprint test plans, test matrices, manual acceptance verification, automated smoke tests, bug reporting, and final test sign-off reports. | 6 / 18 (24 total) |
| **UI/UX Designer** | Clark Deocampo | Design system (`base.css`, `landing.css`, `modules.css`), GitHub Primer dark theme alignment, wireframes, component mockups, usability audits. | 5 / 15 (20 total) |
| **Scrum Master** | Tristan Bacani | Agile boards, user stories, Definition of Done, impediment tracking, velocity monitoring, sprint reviews, and retrospectives. | 5 / 15 (20 total) |
