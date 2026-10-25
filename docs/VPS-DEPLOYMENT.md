# VPS deployment

Use a **separate directory and initially a staging hostname**. Do not overwrite the current PHP website. These examples assume Ubuntu/Debian, Nginx, a maintained Node.js 24 release and a dedicated unprivileged `academy` service account.

1. Extract the project into `/srv/bihar-academy-next`. Install dependencies as the service user using `npm ci`. Build on the VPS with `npm run build`; the downloadable ZIP contains source, not Windows-specific node_modules or a precompiled server.
2. Create a private writable directory, e.g. `/var/lib/bihar-academy`, owned by the service user, mode 0700. It must not be an Nginx document root, static alias, shared network drive or public directory.
3. Copy `.env.example` to `.env` and configure:

```dotenv
APP_ORIGIN=https://academy.example.com
DATA_DIR=/var/lib/bihar-academy
```

Replace the example origin with your actual staging hostname, including scheme and any nonstandard port. Use no path or trailing slash. Keep `.env` private (0600, service-user owner). Run `npm run setup` as the service user in a private interactive terminal. No setup web endpoint or default admin password exists.

4. Install the example `deploy/academy.service` into your systemd service configuration after adjusting username, directory and actual Node executable path (`command -v node`). It binds Next.js to loopback on port 3000. Start one instance; do not configure PM2 cluster mode or multiple replicas against this SQLite file.
5. Configure Nginx using `deploy/nginx.conf.example`, replace hostname, then add TLS through your usual certificate provider. The example server block is intended to sit inside an existing HTTPS setup; certificate paths are intentionally not invented. Forward Host, X-Forwarded-Host and X-Forwarded-Proto exactly as shown. Restrict the Node port to loopback. Let Nginx manage HTTPS redirects and HSTS once a valid certificate is installed.
6. Sign in through the exact APP_ORIGIN. Verify settings save, PDF download, CSV preview/commit, a student attempt and mobile navigation on staging. Server Actions intentionally reject writes from a different origin. No public deployment or domain change was performed during development.

## Service operation

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now academy
sudo systemctl status academy
journalctl -u academy -n 100
```

Only source and build output need read access. DATA_DIR needs write access. The service's `UMask=0077` protects database WAL/SHM files and uploads. Do not proxy arbitrary filesystem paths or serve the project directory with a generic static server. Nginx proxies all application routes to Next.js.

## Backups and updates

```sh
npm run backup -- /var/backups/bihar-academy
```

This uses SQLite `VACUUM INTO` for a database snapshot and copies current uploads. If uploads are being edited during the backup, take a maintenance window to keep files and database paired. Keep backups private and outside the public app. Protect them like user data.

To restore, stop the service, save the current DATA_DIR separately, copy a matching database/uploads backup into DATA_DIR, remove obsolete WAL/SHM files only after the service is stopped and their paths have been verified, restore ownership/mode, then restart and verify. Do not copy only the `.sqlite` file from a running WAL database as your backup method.

For a release update, back up data, install the new source in a separate release directory, preserve the same private DATA_DIR, run `npm ci`, `npm test`, `npm run build`, switch the systemd WorkingDirectory and restart. Keep `.env` and DATA_DIR out of the ZIP, Git and web root. No old MySQL migration is performed by these commands.

## Capacity and runtime notes

Database access and imports use synchronous SQLite calls. This keeps the single-process transaction boundaries straightforward, but large imports briefly occupy that process. Split large jobs, use the documented limits and load-test your expected learner concurrency before broad launch. Multi-server/serverless deployment needs a different shared database/storage implementation. Node 24's built-in SQLite module may emit an experimental-feature notice; this was observed during verification and did not prevent the tested build or workflows.

The application collects account email, name and learning activity. Set real contact/policy content in admin before accepting real registrations. There is no bundled email delivery or automated password-reset mail service; staff can reset a password from the private CLI.
