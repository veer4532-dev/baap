# Bihar Agriculture Academy — Next.js

A complete, runnable source project for a separate Node.js/VPS deployment. It combines a responsive learning website with an authenticated content desk, persistent SQLite data, question imports and server-owned practice attempts.

Start with **START-HERE-HINDI.md**. For VPS hosting see **docs/VPS-DEPLOYMENT.md**. The original PHP archives are design/workflow references, not runtime dependencies. No live website was deployed or modified.

## Commands

```sh
npm ci
# Copy .env.example to .env and configure APP_ORIGIN and DATA_DIR.
npm run setup
npm test
npm run build
npm run start
```

Node.js 24, one application process, persistent local storage. `npm run dev` is available for development. `.env` is loaded by the setup/management scripts and Next.js; use that file consistently.

## Included

- Public homepage, editable header/navigation, library search/filter/pagination, subject hierarchy, articles, revision notes, revealable flashcards, one-liners and PDF resources.
- Student sign-in/registration, saved topics, practice history and password changes.
- Admin/editor authorization, folder manager, manual question forms, bulk visibility/mapping, CSV/ZIP validation and preview, transactional import with duplicate reuse and replay prevention.
- Practice patterns, IST daily challenges, server-side attempt snapshots, autosave/resume, deadlines, grading and explanations.
- Learner search/disable, all-time practice activity board, settings, audit log, private upload storage and backup/user-management tools.
- Responsive layouts, keyboard focus states, labelled controls, reduced-motion support and local SVG artwork.

Source: `app/` routes, `components/` UI, `lib/` database/auth/actions/imports, `scripts/` operations, `tests/` checks, `public/templates/` CSV example, `deploy/` VPS examples.

## Data and compatibility

This is a **fresh SQLite application**, not an automatic migration of either supplied MySQL/PHP project. It does not implement their Android APIs, payment/assignment engines, raw SQL import, advanced question types or gamification. CSV/ZIP imports support single-answer MCQ. Articles use safe plain text with a small heading/paragraph convention. Full limitations are listed in the Hindi guide.

PDFs are validated by size/signature, stored privately and downloaded as attachments through an authorization check. No antivirus engine is bundled. Only upload documents you are authorized to distribute.

Dependency versions are exact and committed in `package-lock.json`. See **docs/SECURITY.md** and **docs/VERIFICATION.md** for the audit and tested boundaries; no claim of complete vulnerability elimination or load certification is made.
