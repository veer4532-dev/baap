# Security changes and dependency disposition

The supplied archives contained PHP applications; neither contained a Next.js package manifest/lockfile. The final deliverable is a new Next.js implementation with its own exact dependency lockfile. No package upgrade was applied to the live website or either original archive.

| Reported dependency | Delivered disposition |
| --- | --- |
| Next.js 16.3.5 | Next.js **16.4.1** pinned. This exceeds the reported 16.3.6 fix and meets the reported 16.4.1 targets. |
| sharp 0.35.4 | **0.35.5** pinned. User SVG uploads and remote image optimization are not enabled. |
| brace-expansion 1.1.18 / 5.0.9 | Neither vulnerable branch is installed. Overrides require 1.1.20 / 5.0.11 if those branches become transitive dependencies. |
| source-map-js 1.2.1 | **1.2.2** locked and overridden. |
| React / React DOM | **19.3.1**, matching current registry versions at implementation. |
| fflate used for ZIP imports | **0.8.3**. The initial candidate 0.8.2 was rejected after audit identified GHSA-px8p-9vwx-vf98; the patched version was installed before delivery. |

References checked: [Next use-cache advisory](https://github.com/advisories/GHSA-673q-mjm6-r5xr), [Next SVG image advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [sharp advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Exact installed dependency results are in the lockfile and `npm audit` evidence. Version selection also follows the user's supplied remediation list.

## Implemented boundaries

- Server-only database access and prepared parameterized SQL; credentials/password hashes are not passed to client components.
- Scrypt password hashes with unique random salts, bounded password input, email/global login limits and registration/write limits stored in SQLite.
- Random session tokens; only SHA-256 token hashes stored in the database. HttpOnly, SameSite=Lax cookies, Secure when APP_ORIGIN uses HTTPS, 12-hour expiry and database-backed account/role checks on every protected action.
- Next Server Action protections plus explicit exact-Origin validation for state-changing actions; staff roles and admin-only settings/user management verified on the server.
- Nonce-based script CSP, denied framing, nosniff, private/no-store responses and local-only navigation URL validation. React escapes editorial content; arbitrary article HTML is not executed. Inline styles are allowed for React styling, but untrusted inline scripts are not allowed by production CSP.
- Private PDF files, random server-generated storage identifiers, size/signature checks, authorized delivery, attachment disposition and sandboxed file response. Draft PDFs are unavailable to students/anonymous users. No SVG or executable upload route exists.
- CSV/ZIP size, row, file-count and path checks; strict single-answer MCQ validation, atomic imports, deduplication and import-state replay protection. ZIP contents are parsed in memory and never extracted to client-chosen filesystem paths.
- Folder cycle prevention and published-ancestor checks for practice access. Attempts use server-created immutable question snapshots, owned-record checks and server deadlines; answer changes after expiry are ignored. Submitted results cannot be rewritten by replaying a save.

## Limits of the verification

An audit returning zero known dependency advisories is a dated registry result, not a proof that all code is vulnerability-free. No external penetration test, antivirus service, high-concurrency load test, real VPS TLS/Nginx/systemd execution or compatibility test against the existing Android/MySQL platform was performed. Tests are enumerated in VERIFICATION.md. Future dependency updates require a new audit and regression checks.
