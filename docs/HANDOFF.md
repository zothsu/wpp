# Handoff Notes

Read this first if you're picking up where a previous session left off. It's
a narrative bridge, not the task list - **the live, current task list lives
in Quire** (project "WPP", https://quire.io/w/Z86504), not here. This file
will go stale; Quire won't. Check Quire's "Website Design" and "CRM/Database"
sections for what's actually open.

## Where things stand (as of 2026-08-13 night)

**Website**: fully live on wildpear.school + enrolled.wildpear.school via the
GitHub Actions deploy pipeline (push to `main` auto-deploys). Local `main` and
`origin/main` are in sync, everything through this note is pushed and
deployed. Recent work, most-recent first:

- **Found and fixed a sitewide production bug**: Astro keeps single-use
  component `<script>` tags inline in the built HTML by default (this is
  independent of `define:vars` - a plain `<script>` with no `src` gets
  inlined too if it's only used on one page/component). The production CSP
  (`script-src 'self'`, no `unsafe-inline`) silently blocks every inline
  script, so anything working in `astro dev` (which never enforces the
  `.htaccess` CSP) could be silently broken in production. This turned out
  to explain two separate-looking bug reports as one root cause: the
  footer login form doing nothing, and `Navbar4`'s scroll/reveal styling
  never applying (reported as "navbar disappeared on the homepage" /
  "lost its background on the enrolled portal" - the nav was rendering
  fine, just permanently stuck in its pre-scroll/pre-reveal state since
  the script that flips `data-scrolled`/`data-revealed` never ran).
  Audited every built page (`npm run build` + grep `dist/**/*.html` for
  inline `<script type="module">`) and found 8 total affected components.
  **Fix pattern**: move the script's logic to a plain file under
  `public/scripts/*.js` (stripping TS-only syntax - it's not processed
  through Astro/esbuild anymore) and reference it with
  `<script is:inline src="/scripts/name.js">`. `is:inline` is required -
  without it, Astro still intercepts even a `src`-attributed tag. See the
  README's "A note on `<script>` tags" section for the short version, and
  the 08-13 commits from "Fix login form..." through "Fix every remaining
  CSP-blocked inline script sitewide" for the full incident.
  Also fixed along the way: the shared login password (now `pass`,
  was `changeme`), the login's redirect target (was a relative
  `/enrolled-students` path resolving against the wrong domain, now
  `https://enrolled.wildpear.school/`), and a related deploy bug where the
  new `public/scripts/` directory was silently dropped by
  `split-deploy.mjs`'s asset allowlist - same failure class as the `crm/`
  rsync-exclude incident below, now flagged explicitly in that file's
  comments.
- Rebuilt `/enrolled-students` from a single hardcoded calendar page into
  a full portal hub: `ResourcesPreview`, `HandbooksPreview`, `FormsPreview`
  (Programs-card-style teasers), and `TuitionRates` (Sprouts/Preschool
  tabs + a separate Summer Camp rates block), all anchor-linked from the
  enrolled-portal nav instead of dropdowns/standalone pages. Replaced the
  hardcoded calendar list with a `calendarEvents` Astro content collection
  (`src/content.config.ts` + `src/data/calendar-events.yaml`) rendered
  next to a native Google Calendar embed (`hello@wildpear.school` - a
  freshly-created calendar, currently empty; the scrollable list is
  separate hand-maintained data and already has the real 2025-2026 dates).
- Added the `@starwind-pro/login-01` block as a "Family Login" popover in
  the main site's footer (client-side shared-password gate only - not
  real auth, see the security note in `Login1.astro`'s props). Migrated
  Starwind to v3 first (confirmed safe: `starwind migrate` found nothing
  to convert, the project's config was already Runtime-based).
- Replaced the footer's Privacy Policy/Terms/Attributions links with an
  accessibility statement (mailto, no visible email address - the user
  has a standing preference against exposing raw phone/email on the site,
  contact form only).
- Removed a gradient-clip-text effect from the homepage h1 (it was fading
  to 70% opacity at the bottom, reading dimmer than the surrounding UI).
- Forked `WelcomeMessage` into `WelcomeHomepage` and `WelcomeEnrolled` so
  the two no longer share one prop-threaded component.
- Added baseline security hardening: `public/.well-known/security.txt`
  (RFC 9116) and `public/.htaccess` with HTTPS redirect, HSTS, and a CSP
  audited against actual embeds. **Also fixed a real incident**: the CI
  deploy workflow's rsync `--exclude` list was missing `crm/`, so
  `--delete` was wiping the EspoCRM install out of `public_html` on every
  deploy. (2026-08-12)
- Forked Hero11 into a project-owned `HeroMain` component specifically so
  it won't get clobbered by future Starwind migrations. (2026-08-12)
- Added `ApproachTeaser`, a bento-grid homepage section linking to
  anchored sections on `/our-approach`. (2026-08-12)

Full day-by-day detail (including 08-10 and 08-11, not summarized above)
is in `WORK_LOG.md`.

**CRM (EspoCRM)**: installed and running at crm.wildpear.school on the same
Hostinger account (shared/Business hosting, LAMP - not Docker; Docker is
reserved for n8n on a separate Oracle Cloud VM, see
`docs/enrollment-form-plan.md` for why). Concretely done tonight:

- MySQL database (`wildpear_crm`) + user (`crm_user`) provisioned, EspoCRM
  installed and running, PHP version/extensions verified, file permissions
  verified, cron job installed and running every minute.
- Admin login works (was reset via `php command.php set-password admin` -
  don't confuse the MySQL DB credentials with the EspoCRM app admin login,
  they're unrelated and this tripped us up once already).
- Data model designed: two custom entities, **Kiddo** (persistent
  per-child roster) and **Enrollment** (one record per submission, links to
  Kiddo). Full field list in `docs/espocrm-data-model.md` - this is the spec
  to build from, don't re-derive it.

No CRM work has happened since 2026-08-11 (the 08-12/08-13 sessions were all
website work) other than the deploy-wipe fix below.

**Not yet done on the CRM**:

- The Kiddo and Enrollment entities themselves haven't been built in
  EspoCRM's Entity Manager yet - the design is finalized and documented, but
  no fields exist in the actual app. This is the next concrete step whenever
  work resumes. ~30 fields total across both entities; walk through it in
  phases (Kiddo's fields first, since Enrollment links to it), don't try to
  dump the whole thing in one message.
- SMTP for EspoCRM email notifications (Quire #45).
- n8n hasn't been provisioned on Oracle Cloud yet, so nothing connects the
  live Astro enrollment forms to EspoCRM - they still just log to console
  (stubbed submit).
- Quire #48: the "Request a Tour" form should eventually feed EspoCRM too,
  not just the two full enrollment forms - noted but not started.

## Things worth knowing before touching anything

- **MySQL DB creds vs. EspoCRM app admin creds are different systems.** Don't
  mix them up (see above).
- **Docker doesn't work on the Hostinger side** - it's shared hosting, no
  root. Anything Docker-based (like the `espocrm-installer` script) belongs
  on the Oracle Cloud VM, not here.
- **The Starwind UI CLI (`npx starwind@latest add <component>`) force-migrates
  the entire component library to its latest registry version**, not just
  the one component you ask for. It already caused one real outage (broke
  the homepage hero) before being fixed properly. If a future component add
  is needed, expect this and budget time to fix fallout, or ask the user
  first given the blast radius. `HeroMain` (forked from Hero11) was created
  partly to get the homepage hero out from under this risk going forward -
  it won't be touched by future `starwind add` migrations.
- **The CI deploy's rsync `--exclude` list controls what survives on the
  server.** It's easy to forget something there and have `--delete` wipe it
  - this already happened once to the live EspoCRM install at
  `public_html/crm/` (fixed 2026-08-12, `crm/` is now excluded). If you add
  another out-of-band directory on the server, add it to the exclude list
  in `.github/workflows/deploy.yml` / `scripts/split-deploy.mjs` too.
- **Any interactive `<script>` in a `.astro` component needs
  `is:inline src="/scripts/your-file.js"` pointing at a real file under
  `public/scripts/`, not a plain inline `<script>` block.** Astro keeps
  single-use component scripts inline in the built HTML by default
  (`define:vars` isn't the deciding factor - even a plain script gets
  inlined), and the production CSP blocks all inline scripts. This one bit
  8 different components before it was caught (2026-08-13) - see the
  README's "A note on `<script>` tags" section for the full pattern. Test
  a new interactive component against the actual deployed site, not just
  `astro dev` - dev never enforces `.htaccess`, so this class of bug is
  invisible locally.
- **`scripts/split-deploy.mjs`'s `sharedAssets` array is a separate
  allowlist from the rsync `--exclude` list above** - it controls which
  top-level `dist/` folders get copied into each portal's `deploy/`
  output in the first place. A new static asset directory (like
  `public/scripts/`, added 2026-08-13) needs to be added here too, or it
  silently won't ship at all, independent of the rsync gotcha.
- **Time tracking**: logged in Quire via `add_task_timelog` against specific
  tasks (not project-level or section-level - sections silently accept but
  never actually store timelogs, learned that one the hard way too). Ask the
  user for actual clock times when logging; there's no reliable way to
  determine "now" or reconstruct session time automatically beyond git
  commit timestamps, which only capture commits, not the full session.
