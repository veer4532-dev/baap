# 3.1 update verification — 24 October 2026

Production build completed successfully with Next.js 16.4.1 / Turbopack. Twelve unit tests passed, including the new YouTube host/ID allowlist, CMS input validation and one-time default-page initialization/preservation checks. Sharp is loaded at server runtime using Node createRequire, avoiding a Windows sandbox junction limitation without changing image validation. Use the documented project working directory when starting the server.

The historical 3.0 verification record follows; the 3.1 browser/HTTP checks could not run: automatic approval review rejected localhost server startup even after network permission was granted. The policy required sandbox approval, which is disabled in this environment. The extended tests/http-smoke.mjs is included for execution in an allowed local/VPS environment, but its new tests are NOT claimed as passed. Dependency audit was executed again on 24 October 2026: zero reported vulnerabilities. See npm-audit-3.1.json.

---

# Verification — 23 October 2026

## Executed

- Production build: `npm run build` with Next.js 16.4.1 / React 19.3.1 on Windows, Node 24.11.1. All application routes compile and render dynamically. Deployment uses standard `next start`; no Windows-built node_modules/build output is shipped.
- `npm test`: **9 automated tests passed** covering CSV BOM/Unicode/quoted multiline parsing, malformed CSV, answer validation, grading, password salt/verification/length, safe internal paths, nested ZIP CSV import, traversal/no-CSV rejection and ZIP file-count limits.
- Production HTTP integration checks: **14 groups passed** on an isolated local QA database:
  1. Public routes and security headers, including fractional-page input handling.
  2. All 11 admin workspace routes render.
  3. Anonymous/student mutations denied.
  4. Editor denied administrator settings.
  5. Cross-origin Server Action mutation denied.
  6. Unsafe navigation links rejected.
  7. Folder save persistence and hierarchy cycle rejection.
  8. Question save and answer bounds.
  9. CSV preview/commit and second-commit rejection.
  10. Server-created attempts and answer/explanation secrecy before submission.
  11. Attempt ownership, server grading and immutable submitted results.
  12. Expired attempts ignore late answer changes and retain last saved answers.
  13. PDF signature/role checks, denied public draft download, authorized attachment/no-store response and disguised SVG rejection.
  14. A draft parent hides descendant practice sets.
- Browser: real admin sign-in, mobile admin menu, editable header setting save/restore, public homepage, admin overview and settings. Responsive viewport checks at 320, 390, 768 and the default desktop viewport; no horizontal page overflow at the checked public/admin views. Images are from the separate SAMPLE/QA dataset, not the empty new-install database.
- Private backup CLI: a SQLite snapshot and the QA uploads directory were successfully copied into a separate private backup folder. Production ownership/restore was not tested.
- Dependency audit: **0 reported vulnerabilities** after Next/sharp/source-map-js pinning and fflate 0.8.3 update. The source-map-js installed version is 1.2.2. Neither brace-expansion branch is installed. Audit evidence is in `npm-audit.json`; exact versions are in `package-lock.json`.

## Reproduce integration checks

`tests/prepare-http.mjs` and `tests/http-smoke.mjs` require `BAA_TEST_MODE=1` and an explicitly isolated DATA_DIR containing `qa-`. Never point these mutation tests at production. Use APP_ORIGIN equal to the running test server's exact origin, prepare the fixture, build/start the app against that same database, then run the smoke script. The fixture stores generated test credentials only in the isolated QA directory; that directory is not included in the deliverable.

## Not verified / scope

- Interactive CLI setup reached the name prompt, but the environment's automatic approval review rejected sending test input to that terminal. Setup's full interactive name/email/hidden-password sequence was therefore not completed in this session. CLI setup is provided for the owner to run privately; no default password is substituted.
- Real Linux VPS/systemd/Nginx/TLS installation and backups under production ownership were not executed here.
- No old MySQL data/accounts, Android app API or old PHP endpoint compatibility was tested. This is a fresh SQLite application.
- No external penetration test, heavy concurrent learner test, browser/device matrix, antivirus integration or full accessibility audit was performed.
- PDF delivery was verified with a synthetic PDF fixture. No copyrighted course PDF was copied from the live website.
- ZIP import combines CSV rows into draft sets. It does not reproduce the supplied PHP panel's complete job engine, original directory mapping, all question types, gamification or arbitrary SQL import.

Future package releases and advisories can change the audit result. Re-run checks when dependencies or deployment configuration change.
