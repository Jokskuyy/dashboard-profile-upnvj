# Test Plan: Black Box Testing & UAT — Dashboard Profile UPNVJ

> **Version:** 1.0
> **Scope:** Vite + React SPA · Vercel Serverless API · Unity WebGL 3D map · Supabase (Auth + RLS)
> **Audience:** QA tester, project team, and UAT participants (Admin kampus + public user representatives)

---

## 0. Why This Order: Black Box First, Then UAT

These two activities answer **different questions**, and the sequence matters.

| | Black Box Testing | UAT (User Acceptance Testing) |
|---|---|---|
| **Question it answers** | "Does the system work *correctly*?" | "Does the system solve the *user's problem* and is it acceptable to ship?" |
| **Who runs it** | You / QA (technical side) | Real users & stakeholders (Admin kampus, students, project sponsor) |
| **Mindset** | Try to *break* it — edge cases, bad input, boundaries | Use it *realistically* — normal day-to-day tasks |
| **Pass criteria** | Actual output = expected output | Business goal achieved + user is satisfied |
| **Defects found** | Functional bugs, crashes, wrong data | "It works but it's confusing / not what we needed" |

**The reason black box must come first:** UAT is expensive and political. You are pulling in busy stakeholders and asking them to sign off. If they hit a basic crash (e.g., the app breaks when a field is empty), you burn their trust and their time, and the session collapses into bug-hunting instead of acceptance. Black box testing is your safety net — it drains out the functional defects *before* real users ever touch it, so UAT can stay focused on "is this the right thing?" rather than "is this thing broken?"

Put simply: **black box proves it works; UAT proves it's the right thing.** You don't want to discover in front of your sponsor that it doesn't even work.

---

# PART 1 — Black Box Test Plan

## 1.1 Objective

Verify that every feature behaves according to the PRD **using only inputs and observable outputs** — no knowledge of the internal code required. We feed the system inputs (clicks, form data, search queries, URLs) and check that what comes back matches expectations.

## 1.2 Why "Black Box" Specifically

Black box testing treats the app as a sealed box: you only care about *input → output*. This is the right technique here because:

- Your acceptance criteria in the PRD are already written as **observable behavior** ("preferensi bahasa tersimpan otomatis", "navigasi berhenti otomatis saat dekat tujuan"). Those map 1:1 to black box test cases.
- It mirrors how a real user experiences the product, so bugs found here are bugs users would actually hit.
- It stays stable even as you refactor internals — a test that checks "search returns the right building" doesn't break when you change how the cache works.

## 1.3 Test Environment

| Item | Requirement | Why it matters |
|---|---|---|
| Build under test | Production build (`npm run build` + `npm run preview`), **not** dev server | Dev mode hides real bundle/lazy-loading/compression bugs |
| Database | A **staging** Supabase project with seed data (`002_seed_data.sql`) | Never test destructive CRUD against production data |
| Browsers | Chrome, Firefox, Safari (desktop) + Chrome/Safari (mobile) | Pointer Lock, Unity WebGL, and joystick behave differently per browser |
| Devices | 1 desktop + 1 real Android + 1 real iOS device | Mobile joystick + data-saver preload are **hard requirements** in the PRD |
| Network | Normal + throttled ("Slow 3G" in DevTools) | The PRD requires < 10s load and mobile-aware preloading |

## 1.4 Black Box Techniques Used (and when)

You don't test randomly — you pick a technique per situation so you get maximum coverage with minimum test cases:

- **Equivalence Partitioning** — group inputs that should behave the same, test one from each group (e.g., valid login / wrong password / non-admin account).
- **Boundary Value Analysis** — bugs cluster at edges. Test `jumlah_lantai` = 0, 1, max; search box with 0, 1, and very long strings.
- **Decision Tables** — for combined conditions (logged in? + is admin? + RLS allows? → allowed action).
- **State Transition** — for flows with states (Unity: idle → navigating → arrived → stopped; language: id ↔ en persisted).
- **Error Guessing** — deliberately do the "wrong" thing (empty required field, SQL/XSS in search, refresh mid-Unity-load, click delete then cancel).

## 1.5 Scope — Modules Under Test

Derived directly from the PRD user stories:

1. Public Dashboard (KPI cards, prodi/accreditation table, traffic stats)
2. Multilingual toggle (id ↔ en) + persistence
3. Building/Facility search (mixed list, icons, parent-building sub-label)
4. Unity 3D map: load, navigation, route line, distance label, auto-stop, Pointer Lock, ESC
5. Mobile controls (virtual joystick visible on mobile, hidden on desktop)
6. Admin authentication (Supabase Auth + RLS)
7. Admin CRUD (gedung, fasilitas, program_studi, fakultas) + delete-confirm modal + audit logs
8. Serverless API contracts (`/api/unity/data`, `/api/unity/names`, `/api/buildings/*`, `/api/rooms/*`, `/api/health`)
9. Non-functional: load time, responsive layout, security (XSS/injection in search, RLS on mutations)

## 1.6 Entry Criteria (start black box only when all true)

- Feature-complete build deployed to staging.
- Seed data loaded; at least one admin account provisioned.
- Unit/integration tests (`npm run test`) pass.
- No known blocker/critical open defects.

## 1.7 Exit Criteria (black box is "done" when)

- 100% of planned test cases executed.
- 0 open Critical or High defects.
- All Medium defects are triaged with an agreed plan (fix now vs. accept for UAT).
- Load-time and mobile requirements verified on real devices.

## 1.8 Test Cases

> Format: **ID · Precondition · Steps · Expected Result · Technique**. Record Pass/Fail + evidence (screenshot/screen recording) per run.

### A. Public Dashboard & Language

| ID | Precondition | Steps | Expected Result | Technique |
|---|---|---|---|---|
| BB-DASH-01 | App loaded | Open `/` | KPI cards, prodi table, and traffic stats render with real seed data | Partition |
| BB-DASH-02 | Data present | Read accreditation table | Each prodi shows correct jenjang (D3/S1/S2/S3) + accreditation | Partition |
| BB-LANG-01 | On `/` in `id` | Click language toggle | UI switches to `en` in real-time, no page reload | State transition |
| BB-LANG-02 | Switched to `en` | Refresh page | Language stays `en` (localStorage persisted) | State transition |
| BB-LANG-03 | Missing translation key (if any) | View that string | Falls back gracefully, no raw key like `dashboard.title` shown | Error guessing |

### B. Search

| ID | Precondition | Steps | Expected Result | Technique |
|---|---|---|---|---|
| BB-SRCH-01 | Search open | Type a building name | Building appears with `Building2` icon | Partition |
| BB-SRCH-02 | Search open | Type a facility name | Facility appears with `LayoutGrid` icon + parent-building sub-label | Partition |
| BB-SRCH-03 | Search open | Type empty / 1 char / very long string | No crash; sensible/no results; no layout break | Boundary |
| BB-SRCH-04 | Search open | Enter `<script>alert(1)</script>` and regex chars `.*[(` | Input sanitized; no script execution; no RegExp error | Error guessing (security) |
| BB-SRCH-05 | Search open | Type a name that doesn't exist | Clean "no results" state | Partition |

### C. Unity 3D Map & Navigation

| ID | Precondition | Steps | Expected Result | Technique |
|---|---|---|---|---|
| BB-3D-01 | On `/` | Trigger 3D map load | Loading overlay + progress bar shown; scene loads < 10s on normal network | Partition |
| BB-3D-02 | Map loaded | Select a location from search | Player navigates automatically; route line renders on floor | State transition |
| BB-3D-03 | Navigating | Follow route across floors/buildings | Route line follows stairs contour and outdoor path between buildings | Partition |
| BB-3D-04 | Navigating | Read distance label | Shows **display name** (e.g., "Ruang MHT 201"), not internal code (`mht_201`), + remaining distance | Partition |
| BB-3D-05 | Navigating | Walk close to target | Navigation stops automatically within stopDistance | Boundary |
| BB-3D-06 | Map focused | Left-click canvas | Pointer Lock engages; 360° camera with no cursor edge-stop | State transition |
| BB-3D-07 | Pointer locked | Press ESC | Cursor released; website UI usable again; page not exited | State transition |
| BB-3D-08 | Map loaded | Refresh mid-load / lose network | Graceful handling, no permanent white screen | Error guessing |

### D. Mobile (Hard Requirement)

| ID | Precondition | Steps | Expected Result | Technique |
|---|---|---|---|---|
| BB-MOB-01 | Real mobile device | Open 3D map | Virtual joystick visible and controls the character | Partition |
| BB-MOB-02 | Desktop | Open 3D map | Virtual joystick **hidden** | Partition |
| BB-MOB-03 | Mobile, data-saver on / metered | Load site | WebGL not auto-preloaded (respects saveData / connection type) | Boundary |
| BB-MOB-04 | Mobile portrait + landscape | Browse dashboard | Layout responsive, no overflow/broken elements | Partition |

### E. Admin Auth & RLS (Decision Table)

| ID | Logged in? | Is admin? | Action | Expected |
|---|---|---|---|---|
| BB-AUTH-01 | No | — | Open `/admin` | Redirected to login (protected route) |
| BB-AUTH-02 | Yes | No | Attempt INSERT/UPDATE/DELETE | Blocked by RLS |
| BB-AUTH-03 | Yes | Yes | CRUD operation | Allowed |
| BB-AUTH-04 | — | — | Login with wrong password | Rejected, clear error, no session |
| BB-AUTH-05 | — | — | Login with valid admin | Session granted, routed to admin dashboard |

### F. Admin CRUD & Safety

| ID | Precondition | Steps | Expected Result | Technique |
|---|---|---|---|---|
| BB-CRUD-01 | Admin | Create gedung with all valid fields incl. `unity_object_name` | Saved; appears in list; audit log entry created | Partition |
| BB-CRUD-02 | Admin | Create with empty required field | Validation error, not saved | Error guessing |
| BB-CRUD-03 | Admin | `jumlah_lantai` = 0, negative, huge number | Boundary handling / validation | Boundary |
| BB-CRUD-04 | Admin | Enter `unity_object_name` with uppercase/spaces | Convention enforced or normalized (lowercase+underscore) | Boundary |
| BB-CRUD-05 | Admin | Click Delete → **Cancel** in modal | Nothing deleted (focus trap works) | State transition |
| BB-CRUD-06 | Admin | Click Delete → **Confirm** | Record deleted; audit log records actor/time/table/data | State transition |
| BB-CRUD-07 | Admin | Update a facility, link to a building + floor | Public search reflects change | Partition |
| BB-CRUD-08 | Admin | Send extra/unpermitted fields in update payload | Mass-assignment rejected (whitelist) | Error guessing (security) |

### G. API Contracts

| ID | Endpoint | Steps | Expected Result |
|---|---|---|---|
| BB-API-01 | `GET /api/health` | Call | `{ "status": "ok" }` |
| BB-API-02 | `GET /api/unity/data` | Call | `{ "gedung": [...], "fasilitas": [...] }` incl. `unity_object_name` |
| BB-API-03 | `GET /api/unity/names` | Call | `{ "unityObjectNames": [...] }` |
| BB-API-04 | `GET /api/buildings/*`, `/api/rooms/*` | Call | Correct shape for React frontend |
| BB-API-05 | Any endpoint, DB unavailable | Simulate failure | Graceful error fallback, no 500 leaking internals |
| BB-API-06 | Pagination endpoint | Request oversized page | Hard-limit enforced (no resource exhaustion) |

### H. Non-Functional

| ID | Check | Expected |
|---|---|---|
| BB-NFR-01 | Load time (Lighthouse, normal network) | Full page incl. 3D < 10s; good LCP/TBT/CLS |
| BB-NFR-02 | Admin bundle | Lazy-loaded (not shipped to public visitors) |
| BB-NFR-03 | Static assets | Served with long-cache/immutable headers |
| BB-NFR-04 | Sensitive data display | Email/phone masked per `sanitizeData` rules |

## 1.9 Defect Severity Scale

- **Critical** — crash, data loss, security hole, core flow blocked (e.g., can't log in, can't navigate). Ship-stopper.
- **High** — major feature wrong (e.g., search returns wrong building, RLS lets non-admin write).
- **Medium** — feature works but degraded (e.g., label shows internal code instead of display name).
- **Low** — cosmetic (spacing, wording).

---

# PART 2 — User Acceptance Test (UAT) Plan

## 2.1 Objective

Confirm with **real users and the project sponsor** that the platform does what UPNVJ actually needs and is acceptable to release. UAT is not about finding bugs (black box already did that) — it's about **validating fitness for purpose and getting sign-off**.

## 2.2 Why UAT Is Structured Around Real Roles & Real Tasks

The PRD defines three user types (Public users, Admin kampus, Developer/technical). UAT must be run **by people who represent those roles**, doing **realistic end-to-end tasks**, because:

- A developer can't judge whether a new student finds the campus map intuitive — only a student can.
- Acceptance is a *business* decision, not a technical one. The sponsor signs off, so the sponsor (or their delegate) must witness the system meeting the original problem statement.
- Real tasks surface "works-as-built but wrong-as-designed" gaps that no test case catches — e.g., the route is technically correct but the label wording confuses people.

## 2.3 Participants

| Role | Represented by | Validates |
|---|---|---|
| Public user / new student | 2–3 students or student reps | Dashboard clarity, search, 3D navigation, mobile experience, language |
| Admin kampus | 1–2 actual admin staff | CRUD workflow, delete safety, audit logs, analytics |
| Project sponsor / PIC | Decision maker | Overall acceptance & sign-off |
| Facilitator | You / QA lead | Runs sessions, records outcomes, does **not** coach participants |

> Key rule: the facilitator sets the scenario and then **stays quiet**. If you guide them, you're testing your ability to explain, not the product's usability.

## 2.4 Entry Criteria (don't start UAT until)

- Black box testing completed with **0 open Critical/High defects**.
- UAT environment mirrors production (same build, staging DB with realistic data, real mobile devices available).
- UAT scenarios and acceptance criteria agreed with the sponsor beforehand.
- Participants scheduled and briefed on *what* to do (not *how*).

## 2.5 UAT Scenarios (Business-Level, Mapped to PRD User Stories)

Each scenario is a real goal, written in the user's language, with a clear acceptance criterion. Participants get the goal, not the steps.

### Public User / Student

| ID | Scenario (goal given to user) | Acceptance Criterion | PRD Ref |
|---|---|---|---|
| UAT-P-01 | "You're a new student. Find out how many buildings/facilities the campus has and see the accredited study programs." | User locates KPI cards + accreditation table unaided | A1 #2 |
| UAT-P-02 | "Read the site in English, then come back tomorrow (refresh) — it should still be in English." | Toggle works; preference persists | A1 #3–4 |
| UAT-P-03 | "Find the room 'MHT 201' (or a known room) and let the 3D map guide you there." | User searches, selects, and follows the route to arrival | A2 #6–9 |
| UAT-P-04 | "While navigating, tell me the name of your destination and roughly how far it is." | User reads a human-readable name + distance (not a code) | A2 #10–11 |
| UAT-P-05 | "Find the main buildings — Rektorat, Masjid, Aula." | Found via search by name | A2 #16 |
| UAT-P-06 | "Do all of the above **on your phone**." | Joystick usable; layout fine; loads in reasonable time | A2 #15, #17 |
| UAT-P-07 | "Look around 360° in the 3D map, then get back to the website." | Pointer Lock + ESC feel natural | A2 #13–14 |

### Admin Kampus

| ID | Scenario | Acceptance Criterion | PRD Ref |
|---|---|---|---|
| UAT-A-01 | "Log in to the admin panel with your account." | Secure login succeeds; non-admins can't get in | B #19 |
| UAT-A-02 | "A new building opened. Add it (with its Unity object name) and add a facility inside it." | Data saved; appears in public search | B #20–21, #23 |
| UAT-A-03 | "Update a study program's accreditation." | Change reflected on public dashboard | B #22 |
| UAT-A-04 | "Delete an entry — but you must confirm first." | Confirmation modal prevents accidental delete | B #26 |
| UAT-A-05 | "Show who changed what and when." | Audit logs readable and accurate | B #27 |
| UAT-A-06 | "Check which pages get the most traffic." | Umami analytics accessible & understandable | B #28 |

### Sponsor / Overall

| ID | Scenario | Acceptance Criterion |
|---|---|---|
| UAT-S-01 | Review whether the platform solves the 3 original problems (fragmented info, hard navigation, no single source of truth). | Sponsor agrees each problem is addressed |
| UAT-S-02 | Confirm scope matches PRD (and out-of-scope items are genuinely out). | No surprise gaps |

## 2.6 How Results Are Recorded

For each scenario, the participant reports one of:

- ✅ **Accepted** — completed the goal unaided, satisfied.
- ⚠️ **Accepted with comments** — done, but with usability friction (log it).
- ❌ **Rejected** — could not complete, or result is wrong/unacceptable (log as UAT defect).

Capture: participant role, scenario ID, outcome, verbatim comments, screen recording where possible.

## 2.7 UAT Defect Handling

UAT findings are usually **not** the same as black box bugs — they're often "correct but not right." Triage each with the sponsor:

- **Blocker for release** → fix, then re-run affected UAT scenarios.
- **Post-launch improvement** → log to backlog, sponsor accepts for now.
- **Misunderstanding / training issue** → clarify, no code change.

## 2.8 Exit Criteria & Sign-Off (UAT is "done" when)

- All UAT scenarios executed by the right roles.
- No open ❌ Rejected items classified as release-blockers.
- Sponsor signs the acceptance record.

**Sign-off record:**

| Name | Role | Decision (Accept / Accept w/ conditions / Reject) | Date | Signature |
|---|---|---|---|---|
| | Sponsor / PIC | | | |
| | Admin representative | | | |
| | Student representative | | | |

---

## Appendix — One-Page Cheat Sheet

```
BLACK BOX  →  "Does it work?"        → run by QA  → break it, edge cases  → fix bugs
    │
    └── exit: 0 Critical/High bugs
                │
                ▼
   UAT        →  "Is it the right thing & acceptable?" → run by real users/sponsor
                                                          → realistic tasks → sign-off
```

**Golden rules**
1. Never start UAT with known Critical/High bugs — you'll waste stakeholders' time.
2. In UAT, give users the *goal*, not the *steps* — then stay quiet.
3. Test the *production build* on *real mobile devices* — mobile is a hard requirement here.
4. Use *staging data*, never production, for destructive CRUD tests.
5. Record evidence (screenshots/recordings) for every result — sign-off needs proof.
