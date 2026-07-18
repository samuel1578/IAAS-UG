# IAAS-UG — Project Guide for AI Agents

> Read this file **first** before editing anything. It documents the project's
> architecture, conventions, database schema, design system, and the rules an
> AI agent must follow to work safely in this codebase.

---

## 1. What this project is

**IAAS-UG** is the student hub web app for the **University of Ghana (Legon),
School of Agriculture** (Institute of Agriculture and Allied Sciences — Undergraduate).

It is a single-page React application that gives agriculture undergraduates:

- An **Academic Hub** (browse the full course catalogue by level → semester → specialization).
- Course **materials** (lecture slides, notes, assignments, recordings) uploaded by admins.
- Supporting modules: **Lab Logbook, Campus Map, Faculty, SRC Noticeboard**.
- **Student Highlights** (student-submitted testimonials, admin-moderated).
- An **Admin dashboard** (user approval, materials upload, course catalogue CRUD, analytics, settings).
- Live **campus weather** (Open-Meteo, UG Legon coordinates).

The backend is **Appwrite Cloud** (Sydney region). There is **no custom
server** — the frontend talks to Appwrite directly via the Web SDK.

> Note: `@supabase/supabase-js` is listed in `package.json` but Supabase is
> **not** used anywhere in the app. Appwrite is the sole backend. Treat the
> Supabase dependency as legacy/unused.

---

## 2. Tech stack

| Concern            | Choice                                                        |
|--------------------|--------------------------------------------------------------|
| Build tool         | Vite 5 (`vite.config.ts`, base `/`, output `dist/`)          |
| Framework          | React 18 (function components + hooks)                        |
| Language           | TypeScript 5 **and** JavaScript (mixed — see §4)             |
| Routing            | `react-router-dom` v7                                         |
| Styling            | Tailwind CSS 3 + a small amount of custom CSS in `index.css` |
| Animation          | `framer-motion` v12                                           |
| Icons              | `react-icons` (mostly `Md*` Material icons) + `lucide-react`  |
| Carousel           | `swiper` v12                                                  |
| Backend / BaaS     | Appwrite Cloud (`appwrite` Web SDK v23)                       |
| Admin scripts      | `node-appwrite` v27 (server SDK, scripts only)               |
| Deployment         | Vercel (`vercel.json`, SPA rewrite to `/index.html`)         |

### Scripts (`package.json`)
```bash
npm run dev        # vite dev server
npm run build      # vite production build -> dist/
npm run preview    # preview built app
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit -p tsconfig.app.json
```
Always run `npm run typecheck` and `npm run lint` after making changes.

---

## 3. Directory layout

```
IAAS-UG/
├─ appwrite.config.json      # Source of truth for Appwrite schema (tables, buckets, teams)
├─ appwrite.md               # Human-readable Appwrite documentation
├─ .env                      # VITE_* env vars (committed here; IDs are non-secret)
├─ vite.config.ts
├─ vercel.json               # SPA rewrites for Vercel
├─ tailwind.config.js        # Font + screen overrides
├─ scripts/
│  └─ migrate-courses.ts     # One-time seed of `courses` collection (node-appwrite)
└─ src/
   ├─ App.tsx                # Router + route guards (ProtectedRoute, LogoutRoute)
   ├─ main.tsx               # React entry
   ├─ index.css              # Fonts (Gelasio), hero styles, toast animations
   ├─ lib/
   │  └─ appwrite.ts         # ALL Appwrite access lives here (services + types)
   ├─ contexts/
   │  └─ AuthContext.tsx     # Global auth/profile/admin state
   ├─ hooks/
   │  ├─ useAcademicHubData.ts  # Course loading + mock seed data + SPECIALIZATIONS
   │  └─ useWeather.ts          # Open-Meteo live weather (cached in localStorage)
   ├─ pages/
   │  ├─ LandingPage.jsx
   │  ├─ AuthPage.jsx        # Two-phase sign up + sign in
   │  └─ Dashboard.jsx       # Module switcher (student vs admin menus)
   ├─ components/
   │  ├─ DashboardLayout.jsx    # Header, sidebar, mobile bottom tabs, weather pill
   │  ├─ AcademicHub/           # Course browsing UI (cards, modal, selectors)
   │  ├─ admin/                 # Admin panels (UserManagement, MaterialUploadForm, ...)
   │  ├─ auth/                  # AuthForm / AuthModal
   │  ├─ modules/               # AcademicHub, LabLogbook, CampusMap, Faculty, SRCNoticeboard
   │  ├─ skeletons/             # Loading skeleton primitives
   │  └─ *.jsx                  # Shared UI (Card, Button, Modal, Footer, etc.)
   ├─ data/                  # homeData.js, mockData.js (landing/static content)
   ├─ assets/               # Images (hero, logos)
   └─ fonts/                # Gelasio woff2 files
```

---

## 4. Architecture decisions & conventions

### 4.1 Mixed TS/JSX — follow the existing pattern
- **New logic, hooks, contexts, and Appwrite code → TypeScript (`.ts`/`.tsx`)**.
- Page and presentational components are historically `.jsx`. When editing an
  existing `.jsx` file, keep it `.jsx` unless there's a strong reason to convert.
- Data-access and shared types belong in `src/lib/appwrite.ts`.

### 4.2 All Appwrite access goes through `src/lib/appwrite.ts`
This file is the **single gateway** to the backend. Do **not** call the Appwrite
SDK directly from components. It exports:

- Initialized services: `account`, `databases`, `storage`.
- `APPWRITE_CONFIG` — all IDs read from `import.meta.env.VITE_*`.
- TypeScript interfaces: `StudentUser`, `StudentHighlight`, `CourseMaterial`, `Course`.
- Service classes (static methods, all return `{ success, ... }` or `{ success, error }`):
  - **`AuthService`** — `signUp`, `signIn`, `signOut`, `getCurrentUser`,
    `getUserProfile`, `ensureUserProfile`, `isCurrentUserAdmin`, `setupAdminUser`,
    `createUserProfileFromAccount`, `hasActiveSession`.
  - **`AdminService`** — `getAllUsers`, `updateUserStatus`, `getUserAnalytics`.
  - **`HighlightsService`** — create/list/moderate highlights, `markUserAsAdmin`.
  - **`MaterialService`** — `uploadMaterial`, query by course/type, delete,
    `getDownloadLink`, `getPreviewLink`.
  - **`CourseService`** — CRUD on the `courses` catalogue collection.

> The one exception currently in the codebase is `useAcademicHubData.ts`, which
> uses `databases.listDocuments` directly (still importing config from
> `lib/appwrite.ts`). Prefer routing new reads through `CourseService`.

### 4.3 Service return contract
Every service method returns a plain object, never throws to the caller:
```ts
// success
{ success: true, users: [...] }      // or highlight / material / course / analytics
// failure
{ success: false, error: "message" }
```
UI code checks `result.success` and reads the typed payload or `error`.
**Keep this contract when adding methods.**

### 4.4 Auth & profile model (important — read carefully)
- Appwrite **Account** = the login identity (email/password). Created via
  `account.create` + `account.createEmailPasswordSession`.
- The **`users` collection document** = the extended student profile. Its
  **document ID equals the Appwrite account `$id`** (1:1 link). This is how
  profile lookups work (`getDocument(db, users, user.$id)`).
- **Sign up is two-phase** (`AuthPage.jsx`): Phase 1 personal info, Phase 2
  academic info. On submit it creates the account, then the profile. If profile
  creation fails it **rolls back** (deletes the orphaned account).
- **Session safety:** `signIn` deletes any existing session before creating a
  new one (avoids Appwrite "session is active" errors).
- **Self-heal:** `AuthService` can create a minimal profile for an account whose
  profile document is missing, but `ensureUserProfile` intentionally does **not**
  auto-create — it returns `{ needsProfile: true, errorCode: 404 }` so the UI
  can handle the incomplete-profile case.
- **New users are `profileStatus: 'pending'` and `isVerified: false`** and must
  be **approved by an admin** before they gain verified privileges.

### 4.5 Admin detection (two mechanisms)
`AuthService.isCurrentUserAdmin()` checks, in order:
1. **Appwrite account label** `isadmin` (preferred).
2. Fallback: the profile's `isAdmin` boolean flag.

Database/storage **write permissions** are governed by the Appwrite
**`admins` team** (`team:admins`), which is separate from the UI-level flag.
To fully empower an admin you generally need **both** the label/flag (for UI)
**and** team membership (for permissions).

### 4.6 Global state: `AuthContext`
`src/contexts/AuthContext.tsx` wraps the app (in `App.tsx`) and exposes via
`useAuth()`:
```ts
user, userProfile, isLoading, isCheckingAuth, isAuthenticated, isAdmin,
signIn, signUp, signOut, refreshProfile
```
On mount it resolves the session, ensures the profile, and computes admin status.
Consume auth **only** through `useAuth()`.

### 4.7 Routing & guards (`App.tsx`)
| Path                 | Component        | Guard                                |
|----------------------|------------------|--------------------------------------|
| `/`                  | `LandingPage`    | public                               |
| `/auth`              | `AuthPage`       | public (redirects out if logged in)  |
| `/logout`            | `LogoutRoute`    | signs out, sets `logoutSuccess` flag |
| `/dashboard/:level`  | `Dashboard`      | **`ProtectedRoute`** (auth required) |

- `ProtectedRoute` shows a spinner while `isLoading`, else redirects
  unauthenticated users to `/`.
- Page transitions use `framer-motion` `AnimatePresence` keyed on `location.pathname`.
- `ScrollToTop` resets scroll on navigation.
- The `:level` param (100/200/300/400) drives which courses the Academic Hub loads.

### 4.8 Dashboard module system (`Dashboard.jsx` + `DashboardLayout.jsx`)
- The dashboard is a **module switcher**, not nested routes. `activeModule`
  state selects which component renders in the content area.
- **Menus differ by role:**
  - **Student:** Academic Hub, Lab Logbook, Campus Map, Faculty, SRC Noticeboard.
  - **Admin:** Academic Hub (→ `CourseMaterialsNavigator`), User Management,
    Analytics, Settings, Course Catalog.
- Mobile uses a **bottom tab bar** with an overflow "More" sheet
  (`BottomTabMoreMenu`). Primary tabs differ for admin vs student.
- A `DashboardShellSkeleton` renders until `userProfile` resolves.

### 4.9 Data loading pattern
- Courses: `useAcademicHubData(userLevel)` loads from the `courses` collection
  (`Query.equal('level', level)`, `limit 100`), then filters client-side by
  semester and (for level ≥ 300) specialization. It also exports
  `mockCoursesData` (the canonical seed) and `SPECIALIZATIONS`.
- Weather: `useWeather()` caches Open-Meteo results in `localStorage`
  (`ug_legon_weather_cache`, 20-min TTL); background refresh failures stay silent.

### 4.10 Specialization rule
Levels **100 and 200** show all semester courses. Levels **300 and 400**
require the student to pick a **specialization**; then only courses whose
`specialization` array is empty (shared/core) **or** includes the chosen
specialization are shown. The eight specializations are in `SPECIALIZATIONS`.

---

## 5. Appwrite backend

**Source of truth: `appwrite.config.json`.** Keep it, `appwrite.md`, the `.env`
IDs, and the TS interfaces in `lib/appwrite.ts` **in sync** whenever the schema changes.

- **Endpoint:** `https://syd.cloud.appwrite.io/v1` (Sydney)
- **Project ID:** `6a5298ae00025336f799` (name `IAAS-UG`)
- **Database ID:** `iaas_ug`
- **Admin team ID:** `admins`
- **Storage bucket ID:** `materials_bucket`

### 5.1 Environment variables (`.env`, all `VITE_`-prefixed)
```
VITE_APPWRITE_ENDPOINT                 = https://syd.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID               = 6a5298ae00025336f799
VITE_APPWRITE_DATABASE_ID              = iaas_ug
VITE_APPWRITE_USERS_COLLECTION_ID      = users
VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID = highlights
VITE_APPWRITE_MATERIALS_COLLECTION_ID  = materials
VITE_APPWRITE_COURSES_COLLECTION_ID    = courses
VITE_APPWRITE_BUCKET_ID                = materials_bucket
VITE_APPWRITE_ADMIN_TEAM_ID            = admins
```
> `VITE_APPWRITE_SPECIALIZATIONS_COLLECTION_ID` is referenced in code but has no
> backing collection yet (placeholder). Specializations are currently a static
> array (`SPECIALIZATIONS`).

### 5.2 Collection: `users` (row security ON)
1:1 with the Appwrite account (**document ID = account `$id`**).

| Field         | Type    | Notes                                                             |
|---------------|---------|------------------------------------------------------------------|
| `email`       | string(255), email format | required, **unique index**                    |
| `name`        | varchar(255) | required                                                     |
| `level`       | varchar(10)  | required (stored as string, e.g. `"100"`)                   |
| `studentId`   | integer | required, 0–99,999,999 (max 8 digits, validated in `signUp`)      |
| `department`  | enum    | `Bsc_Agricultural_Science` \| `Bsc_Food_and_Consumer_Science`     |
| `phoneNumber` | integer | required                                                          |
| `isVerified`  | boolean | default `false`                                                   |
| `isAdmin`     | boolean | default `false`                                                   |
| `profileStatus` | enum  | `pending` \| `approved` \| `rejected`, default `pending`         |
| `createdAt`   | datetime | required (ISO string set by client)                             |

Indexes: `email_unique` (unique), `status_idx`, `verified_idx`, `dept_idx`.
Permissions: read `any`; create `users`; update/delete `team:admins`.

### 5.3 Collection: `highlights` (row security OFF)
Student testimonials, admin-moderated.

| Field         | Type    | Notes                                          |
|---------------|---------|------------------------------------------------|
| `userId`      | varchar(36) | required (author account id)               |
| `studentName` | varchar(255) | required                                  |
| `level`       | varchar(10)  | required                                  |
| `message`     | varchar(1000) | required                                 |
| `status`      | enum    | `pending`/`approved`/`rejected`, default `pending` |
| `createdAt`   | datetime | required                                      |
| `approvedBy`  | varchar(36) | optional (admin id)                        |

Indexes: `status_idx`, `created_idx` (DESC).
Business rule: **only verified users** may create highlights
(`HighlightsService.canUserCreateHighlights`). Public views show
`status === 'approved'` only.

### 5.4 Collection: `materials` (row security OFF)
Metadata for uploaded course files.

| Field          | Type    | Notes                                                    |
|----------------|---------|---------------------------------------------------------|
| `courseCode`   | varchar(20) | required                                            |
| `level`        | integer | required (**integer here**, unlike `users.level` string)|
| `semester`     | integer | required                                                |
| `year`         | integer | required                                                |
| `materialType` | enum    | `lecture slides`/`notes`/`assignments`/`recordings`     |
| `title`        | varchar(255) | required                                            |
| `description`  | varchar(1000) | optional                                          |
| `fileUrl`      | varchar(36) | required — stores the **storage file `$id`**, not a URL |
| `uploadedBy`   | varchar(36) | required                                             |
| `uploadedDate` | datetime | required                                                |

Indexes: `course_idx`, `type_idx`, `date_idx` (DESC).
Permissions: read `any`; create/update/delete `team:admins`.
Note: `fileUrl` holds the file ID; download/preview links are generated at
runtime via `MaterialService.getDownloadLink/getPreviewLink`.

### 5.5 Collection: `courses` (catalogue — not in `appwrite.config.json`)
Referenced by `.env` and `CourseService`; seeded by `scripts/migrate-courses.ts`.
Document **ID = course `code`** (e.g. `AGEN101`). Fields (from `Course` interface):

| Field            | Type      |
|------------------|-----------|
| `code`           | string    |
| `title`          | string    |
| `credits`        | number    |
| `type`           | string (`C` = core, `E` = elective) |
| `semester`       | number (1 or 2) |
| `level`          | number (100/200/300/400) |
| `description`    | string    |
| `prerequisites`  | string[]  |
| `specialization` | string[]  (empty = shared/core; else which specializations require it) |

> If you add/modify the `courses` collection, also update `appwrite.config.json`
> so the schema stays documented.

### 5.6 Storage bucket: `materials_bucket`
- Read `any`; create/update/delete `team:admins`; `fileSecurity: true`.
- Max file size **100 MB** (also enforced in app).
- Allowed extensions: `pdf, pptx, mp4, docx, jpg, png, xlsx`.
- Encryption + antivirus enabled, no compression.

### 5.7 Team: `admins`
Backs all `team:admins` permissions. UI admin flag/label is separate (§4.5).

---

## 6. Design system

### 6.1 Brand colors (hardcoded Tailwind arbitrary values — use these exact hexes)
| Token / usage             | Hex        |
|---------------------------|------------|
| Primary green (brand)     | `#00592D`  |
| Dark green (hover/accent) | `#004721` / `#004620` |
| Gold / accent             | `#F2A900`  |
| Gold hover                | `#D98A00`  |
| Deep green text           | `#1E4620`  |
| Light green chip bg       | `#E6F4EA`  |
| App background            | `#F8F9FA`  |
| Header background         | `#F9FAFB`  |
| Border gray               | `#E5E7EB`  |
| Warm off-white (hero)     | `#F7F6F1` / `#F6F2E9` |

Colors are applied as Tailwind **arbitrary values** e.g.
`bg-[#00592D]`, `text-[#F2A900]`, `border-[#E5E7EB]`. There is **no** custom
Tailwind color theme — match the existing hexes above rather than inventing new ones.

### 6.2 Typography
- **Gelasio** (serif) is the global font — self-hosted woff2 in `src/fonts/`,
  registered via `@font-face` in `index.css`, and set as `sans`/`serif`/`gelasio`
  in `tailwind.config.js`. `html, body, *` all use Gelasio.
- Weights: 400 (regular), 400 italic, 700 (bold).
- Placeholders render in **italic Gelasio**.
- `Cinzel` + `Source Serif 4` are imported from Google Fonts in `index.css`
  (available for headings/accents).
- `xs` font size is bumped to 14px (from Tailwind's 12px default).

### 6.3 Layout & responsiveness
- Custom breakpoint `xs: 320px`; standard Tailwind `sm/md/lg` otherwise.
- **Mobile-first.** Desktop uses a fixed "bento" header with rounded white pill
  cards (`rounded-2xl`, `border-[#E5E7EB]`). Mobile uses a simplified top bar +
  fixed bottom tab navigation with `env(safe-area-inset-bottom)` padding.
- Cards/pills: `rounded-2xl` (containers), `rounded-lg` (buttons/inputs),
  `rounded-full` (chips/badges).
- Respect safe-area insets on mobile navigation.

### 6.4 Motion
- Use `framer-motion` for route/module transitions and reveal animations.
- Common module transition: `initial {opacity:0, y:20} → animate {opacity:1, y:0}
  → exit {opacity:0, y:-20}`, `duration: 0.3`, keyed by `activeModule`.
- Dashboard background uses a slow Ken Burns scale (desktop) via `motion.div`.

### 6.5 Loading states
- Prefer **skeletons** over spinners for content. Primitives live in
  `src/components/skeletons/` (`Skeleton`, `SkeletonText`, `SkeletonAvatar`,
  `SkeletonCard`). Full-screen auth/route loads may use the green spinner
  (`border-[#00592D] border-t-transparent animate-spin`).

### 6.6 Icons
- Default to `react-icons/md` (`Md*`). Weather uses `react-icons/wi` + `react-icons/fa`.
- `lucide-react` is available and is **excluded from Vite dep optimization**
  (`vite.config.ts`) — keep that exclusion if you touch the config.

---

## 7. Deployment
- Hosted on **Vercel**. Build: `npm run build` → `dist/`.
- `vercel.json` rewrites everything to `/index.html` (SPA) except `/assets/*`.
- `.env` `VITE_*` values must be set in the Vercel project for production.

---

## 8. Admin / maintenance scripts
- `scripts/migrate-courses.ts` seeds the `courses` collection from
  `mockCoursesData`. It is **not** bundled with the app (lives outside `src/`),
  uses the **server SDK** (`node-appwrite`), and is idempotent (skips existing
  docs by ID). Run with:
  ```bash
  # PowerShell
  $env:APPWRITE_API_KEY = "your-admin-api-key"
  npx tsx scripts/migrate-courses.ts
  ```
  Requires `APPWRITE_API_KEY` (never hardcode it). Endpoint/project/db/collection
  default to this project's values but are overridable via env vars.

---

## 9. Rules for AI agents (do / don't)

**Do**
- Route all backend calls through the service classes in `src/lib/appwrite.ts`;
  add new methods there following the `{ success, ... }` contract.
- Reuse the exact brand hex values (§6.1) and Gelasio typography.
- Use `useAuth()` for auth/profile/admin; never re-implement session logic.
- Keep `appwrite.config.json`, `appwrite.md`, `.env` IDs, and TS interfaces in sync.
- Preserve the pending/approved verification flow and the "verified-only can post
  highlights" rule.
- Run `npm run typecheck` and `npm run lint` before finishing.
- Match existing file types (`.jsx` vs `.tsx`) when editing existing files.

**Don't**
- Don't call the Appwrite SDK directly from components.
- Don't add Supabase usage — it is unused/legacy here.
- Don't hardcode secrets or an `APPWRITE_API_KEY` anywhere in `src/` (server keys
  belong only in scripts, via env vars).
- Don't invent new brand colors or swap the font.
- Don't confuse `users.level` (string) with `materials.level` / `courses.level`
  (integers), or treat `materials.fileUrl` as a URL (it's a storage file ID).
- Don't bypass `ProtectedRoute` or the admin team/label checks for gated features.

---

## 10. Quick reference — key files
| Need to…                          | Go to                                     |
|-----------------------------------|-------------------------------------------|
| Add/modify backend calls          | `src/lib/appwrite.ts`                      |
| Change auth/profile/admin state   | `src/contexts/AuthContext.tsx`            |
| Add/guard a route                 | `src/App.tsx`                             |
| Change dashboard modules/menus    | `src/pages/Dashboard.jsx`, `src/components/DashboardLayout.jsx` |
| Course catalogue logic            | `src/hooks/useAcademicHubData.ts`, `CourseService` |
| Course browsing UI                | `src/components/AcademicHub/`             |
| Admin panels                      | `src/components/admin/`                    |
| Design tokens / fonts             | `tailwind.config.js`, `src/index.css`     |
| Appwrite schema                   | `appwrite.config.json`, `appwrite.md`, `.env` |
| Seed courses                      | `scripts/migrate-courses.ts`              |
```
