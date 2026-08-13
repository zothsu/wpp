# Handoff Notes

Read this first if you're picking up where a previous session left off. It's
a narrative bridge, not the task list - **the live, current task list lives
in Quire** (project "WPP", https://quire.io/w/Z86504), not here. This file
will go stale; Quire won't. Check Quire's "Website Design" and "CRM/Database"
sections for what's actually open.

## Where things stand (as of 2026-08-13)

**Website**: fully live on wildpear.school + enrolled.wildpear.school via the
GitHub Actions deploy pipeline (push to `main` auto-deploys; local `main` is
currently 1 commit ahead of `origin/main` - unpushed). Recent work:

- Migrated the whole Starwind UI component library to its v2 registry (needed
  to add the `carousel` component - see the commit for what broke and how it
  was fixed), added a photo carousel + WelcomeMessage section to the
  homepage, gave Programs cards a hover effect. (2026-08-11)
- Added baseline security hardening: `public/.well-known/security.txt`
  (RFC 9116) and `public/.htaccess` with HTTPS redirect, HSTS, and a CSP
  audited against actual embeds (Google Maps + YouTube-nocookie only).
  **Also fixed a real incident**: the CI deploy workflow's rsync
  `--exclude` list was missing `crm/`, so `--delete` was wiping the
  EspoCRM install out of `public_html` on every deploy. Fixed in the same
  commit. (2026-08-12)
- Forked Hero11 into a project-owned `HeroMain` component (badge dropped,
  moved into the Welcome section as an intro line) specifically so it
  won't get clobbered by future Starwind migrations the way things have
  before. Also centered the "How to Enroll" step cards on mobile.
  (2026-08-12)
- Added `ApproachTeaser`, a bento-grid homepage section linking to anchored
  sections on `/our-approach` (added stable `id`s to all 8 Feature10
  theme sections for this). Gave the Welcome section its own full-bleed
  green-900 background. (2026-08-12)
- Fixed `Footer3`'s link-columns grid to size to the actual column count
  instead of always reserving 3 (was leaving a big empty gap on the
  enrolled portal, which only has 1 column). (2026-08-12)
- Styled the Welcome section's tagline as an accent-bordered italic
  blockquote; centered it and the Programs/ApproachTeaser section intros
  to match how How to Enroll / Request a Tour already render. (2026-08-12)
- Parameterized `WelcomeMessage` (heading/quote/body/signoff/signature
  props, defaults preserve the homepage copy) and added a tailored Welcome
  section to the enrolled-students calendar page. (2026-08-13)
- Reordered the homepage so `Enrollment` renders before `PhotoCarousel`.
  (2026-08-13, uncommitted-message commit "change layout")

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
- **Time tracking**: logged in Quire via `add_task_timelog` against specific
  tasks (not project-level or section-level - sections silently accept but
  never actually store timelogs, learned that one the hard way too). Ask the
  user for actual clock times when logging; there's no reliable way to
  determine "now" or reconstruct session time automatically beyond git
  commit timestamps, which only capture commits, not the full session.
