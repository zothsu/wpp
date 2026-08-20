# Work Log

Tracks working sessions on this project — when, how long, and what got done — for billing reference.

**Methodology / caveat:** times are reconstructed from git commit timestamps and Claude Code conversation activity, not a dedicated time tracker. Treat durations as estimates and adjust before invoicing.

| Date       | Time (approx.)      | Duration (approx.) | Summary                                                                                                                                                                                                     |
| :--------- | :------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-04 | ~11:33 PM             | not tracked          | Initial project scaffold: Astro + Starwind UI setup, base pages (home, learn-about-us, our-approach, who-we-are, enrollment, privacy, terms), starter content/images. ("initial commit, day 1")            |
| 2026-08-05 | ~11:20 AM – 4:35 PM   | ~5 hrs               | See breakdown below.                                                                                                                                                                                        |
| 2026-08-06 | ~1:00 PM – 5:30 PM, ~8:00 PM – 10:00 PM | ~6.5 hrs | See breakdown below.                                                                                                                                                                                        |
| 2026-08-07 | ~9:45 AM – 1:40 PM   | ~4 hrs               | See breakdown below.                                                                                                                                                                                        |
| 2026-08-08 | ~11:15 AM – 11:35 AM, ~4:00 PM – 7:30 PM | ~4.5 hrs | See breakdown below.                                                                                                                                                                                        |
| 2026-08-09 | ~11:45 AM start noted, no commits found | unknown | Session started per an earlier note in this log, but no commits exist for this date - can't reconstruct what happened. Flagging rather than dropping the row; adjust/remove when the actual time is known. |
| 2026-08-10 | ~2:00 PM – 4:40 PM, ~7:20 PM – 9:15 PM | ~4.5 hrs | See breakdown below.                                                                                                                                                                                        |
| 2026-08-11 | ~12:15 PM – 1:25 PM, ~10:15 PM – 10:30 PM+ | ~1.25 hrs of commits, plus an EspoCRM install/config session that night with no corresponding commits (server-side work) - see handoff doc for that portion | See breakdown below. |
| 2026-08-12 | ~3:30 PM – 5:10 PM | ~1.5 hrs | See breakdown below.                                                                                                                                                                                        |
| 2026-08-13 | ~9:25 AM – 8:41 PM | ~11.25 hrs | See breakdown below.                                                                                                                                                                                        |
| 2026-08-14 | ~12:50 PM – 6:45 PM | ~6 hrs | See breakdown below.                                                                                                                                                                                        |
| 2026-08-15 | ~2:00 PM – present | in progress | See breakdown below.                                                                                                                                                                                        |
| 2026-08-19 | ~4:25 PM – 10:28 PM | ~5 hrs | See breakdown below.                                                                                                                                                                                        |

## 2026-08-05 session detail

- Swapped heading font from Patrick Hand to Gochi Hand; removed the `font-preview.astro` comparison page once the choice was made.
- Iterated on the `/learn-about-us` background treatment (added a dark overlay over the aurora background, then removed the aurora background + overlay entirely per feedback — it read as "weird").
- Diagnosed and fixed a local dev-server bug: `astro` on PATH was resolving to a stale global install (v5.7.9) instead of the project's local Astro (v7.1.6), which broke SVG icon rendering (`@tabler/icons`) on any page using the navbar or contact form.
- Extracted the "Our Programs" grid + "Schedule a Tour" contact form out of `/learn-about-us` into a reusable `ProgramsAndTour` component.
- Built a new `/programs` page using that component; updated the nav's "Our Programs" link to point there.
- Installed the Starwind Pro `hero-22` component and added it to `/learn-about-us` (eyebrow, heading, image, button); fixed a bug in the component so it supports local `/public` images (needed explicit width/height).
- Brainstormed 12 hero headline options (baby-led care / emotional intelligence / outdoor play / play-builds-the-brain themes); picked "Rooted in nature, ready for the world" and updated the eyebrow to "Wild Pear Preschool & Summer Camp for All."
- Added a Sitemap section to `README.md` listing all routes, and preserved the full headline list there for future reference.
- Started this work log.
- Wrapped program cards in `ul`/`li` for group semantics.
- Added `/programs/infant-toddler`, `/programs/preschool`, `/programs/summer-camp` detail pages (each with a program-specific accordion, a schedule table for preschool, and a Request a Tour form); matched Hero22's button styling to the homepage hero; moved FAQ to the end of the footer's "Learn About Us" column; added `TODO.md` as a durable, repo-tracked to-do list.
- Set `--primary-accent` to orange-400 globally (replacing hardcoded per-element orange); documented the "prefer global style/token changes" preference in `CLAUDE.md`; removed dead social-icon code from Team1; small copy fix.
- Trimmed a redundant "Send a Message" header and renamed the submit button to "Request a tour."
- Added the `Enrollment.astro` 3-step "How to Enroll" timeline component and a "Still have questions?" block; built a new `/contact` page with an FAQ accordion (extracted shared FAQ data into `src/data/faqs.ts`); reworked `/enrollment-information`; fixed nav/footer contact links; added a reusable "accent" button variant.
- Added `/tuition` page; expanded `/who-we-are` with the real founding story and fuller bios; restricted the display heading font to h1/h2 only (h3-h6 use the body font sitewide); decided against publishing real phone/email anywhere on the site (contact form stays the only channel).

## 2026-08-06 session detail

- Rebuilt `/our-approach`: swapped in an image-based FAQ layout and image-based "Our Approach to Learning" theme sections (placeholder photos, tracked in `TODO.md`), replaced the enrolling callout with a centered CTA card, cleaned up a vendor component, and corrected the summer camp age range to 5-10.
- Built the `/handbook` hub plus Preschool, Sprouts (infant/toddler), and Summer Camp handbook pages from the family handbook and summer camp PDFs; extracted a shared `FamilyHandbookContent` component that branches per program only where content actually differs (daily schedule, what to bring, toileting/diapering).
- Added a reusable `AlertWarning` callout and used it throughout the handbooks for actionable, must-know rules.
- Wired the shader-silk-ribbon animated background into the base `Layout`.
- Scoped handbook headings to the body font and relabeled "Effective" to "Last Updated," without touching `/privacy` or `/terms`.
- Fixed a site-wide anchor-scroll bug (jump-to-section links landing behind the sticky nav) with a single `scroll-padding-top` rule.
- Caught and corrected a program-naming mistake: there is no "Kindergarten" class at Wild Pear — renamed that handbook to Infant & Toddler (Sprouts) and updated the hub, nav, and program-page CTA links accordingly.
- Linked each program page's CTA directly to its own handbook instead of the generic hub; moved "Still have questions?" to the end of the enrollment info page.
- Rebuilt all three program pages with `@starwind-pro/service-page-06` (flattened prose sections plus a sticky sidebar with photo, quick facts, and a CTA) in place of the accordion; wired the shader-silk-ribbon background into `AboutLayout` and `EnrolledLayout` as well.
- Brought `README.md`'s sitemap up to date (it was missing `/contact`, `/tuition`, and the whole handbook section, and still flagged the program pages as unbuilt).
- Renamed `/handbook` to `/handbooks` throughout (hub, all three sub-pages, footer label, program CTAs, README) for consistency.
- Changed program page sidebar CTAs from "View the Handbook" to "Request a Tour," linking to the existing tour form at the bottom of the page instead of duplicating the handbook link.
- Built `/resources` as a link directory (`@starwind-pro/blog-02`) covering all 18 links from the old site's resources page, tagged with pill categories (Handbook, Official, App, Instagram, Pinterest, Inspo). Added a build-time utility that fetches each external link's `og:image` and caches results locally, with placeholder art for anything that doesn't resolve one (Instagram/Pinterest reliably don't). Wired `/resources` directly into the enrolled-family nav, removing the old unbuilt Videos/Tax Info dropdown.
- Fixed rounded-corner mismatches on Hero22, Feature8, and Feature10 (outer section wasn't rounded to match the inner image frame/panels).
- Gave Hero22 a dedicated mobile layout — heading/description, then image, then buttons — instead of the default stacked order, since the desktop "notch" composition couldn't be reordered with simple flex `order` alone; the eyebrow text also now wraps onto two lines on mobile.
- Fixed a real bug on the homepage hero (Hero11): the background image wasn't filling the section on shorter viewports because it relied on a percentage height against a parent that only had `min-height` set, so it silently fell back to a fixed 500px floor. Switched it to absolutely fill the section instead.

## 2026-08-07 session detail

- Made the site footer full-viewport height sitewide (global style fix on Footer3, not a homepage-only override) and gave the footer's brand title a mobile-only line break on "&" so "Wild Pear Preschool & Summer Camp" wraps cleanly on small screens.
- Trialed the `@starwind-pro/shader-glass-aurora` animated background in place of the shader-silk-ribbon; decided against it and fully uninstalled both shader components plus the shared shader-runtime utility, reverting all three layouts to their plain pre-shader structure.
- Trialed `@starwind-pro/shader-aurora-veil` and then `shader-night-clouds` as further background options; settled on shader-night-clouds wired into all three layouts, pinned behind page content, with a translucent footer backdrop so it stays visible.
- Removed the "Still Have Questions?" block from `Enrollment.astro` and fixed a step-grid layout gap; renamed the "Schedule a Tour" enrollment step to "Request a Tour" and revised the application-step copy.
- Applied heading font/size/alignment fixes to the nav logo; declared h1/h2 sizing globally in `starwind.css` and stripped the now-redundant per-heading size/weight classes sitewide.
- Installed `@starwind-pro/feature-12` (+ `tabs`) and used it for a tabbed tuition-rate breakdown by cohort; extracted that into a reusable `Tuition` component.

## 2026-08-08 session detail

- Consolidated `/programs` into `/learn-about-us` and deleted the standalone page; repointed the nav link, Hero22's CTA button, and Enrollment's tour-request step accordingly.
- Added weekly-themes cards to the summer camp page (`@starwind-pro/blog-06`, customized for start/end dates and an optional closure note) and fixed several copy issues (a stray word that landed mid-sentence, a typo, an awkward sentence).
- Restyled the contact form to match the tour-request form's layout and reordered the FAQ list.
- Restructured the summer camp page's "Cost & Schedule" section into Dates/Hours/Cost subsections with a bordered callout box.
- Fixed a color-token inconsistency where Prose's body text rendered visibly darker than sibling text using `text-muted-foreground` directly; unified them at the shared Prose component level. Also lightened the sitewide `--muted-foreground` token.
- Extracted a dedicated `SignupNewsletter` component instead of overloading the shared `Cta10` component with an opt-in email-capture form (which would have affected 3 other pages using `Cta10` as a plain link button).
- Added a third "Dates" highlight (September - June) to the Preschool and Infant/Toddler program pages; renamed "Cost" to "Tuition" in the summer camp heading; cleaned up leftover copy-pasted content on the Preschool page.
- Restructured handbook content: moved winter weather into an `AlertWarning` callout, removed irrelevant summer-camp/summer-weather mentions from the shared Preschool/Sprouts content, converted both daily schedules from prose into Time/Activity tables, and gave the `/handbooks` hub cards a background treatment.

## 2026-08-10 session detail

- Split the site into two independent portals with a chooser homepage (later folded back into one on 08-11 - see below); this landed via PR #1 on the `worktree-two-portal-split` branch.
- Renamed the prospective-parent subdomain from `lookingat` to `learn`.
- Set the sitewide body default font size to 18px and removed now-redundant `text-lg` overrides scattered across components.
- Switched the homepage hero's heading/badge/button text to fluid `clamp()` sizing instead of fixed breakpoint steps; iterated on hero height (capped at 80vh, then restored to full-screen), badge/heading spacing, and button padding to match the larger fluid text.
- Styled the primary hero button's hover as solid accent-orange with white text, and increased the secondary button's hover opacity.
- Fixed Footer3: removed a stray `min-h-screen` so it sizes to its actual content instead of always filling the viewport, fixed a missing space before the "&" in the company name, and made the brand column span full width and center when there are no link columns.
- Made "All rights reserved." break onto its own line on small screens.
- Added the GitHub Actions workflow that auto-deploys to Hostinger on every push to `main` - this is the deploy pipeline everything since has shipped through.

## 2026-08-11 session detail

- Folded the `learn.wildpear.school` deploy target back into `wildpear.school` and simplified `SiteFooter` to a single default portal - reversing the two-portal split from the day before in favor of merging the `learn-about-us` content straight into the homepage.
- Added a `WelcomeMessage` component and wired it into the homepage below the hero; styled it (dropped its image, widened and justified the text, added a signature line in a new `--font-signature` token).
- Upgraded the whole Starwind UI component library to its v2 registry (needed to add the `carousel` component), added a photo carousel to the homepage below the welcome message, and gave the Programs cards a hover effect (scale up, accent border).
- Untracked a stray `.claude/worktrees/two-portal-split` gitlink that had been accidentally committed.
- That evening (~10:15-10:30pm+, no corresponding commits since this was server-side infrastructure, not repo changes): installed and configured EspoCRM at `crm.wildpear.school` on the same Hostinger account - MySQL database + user provisioned, PHP/permissions verified, cron job installed, admin login fixed, and designed the Kiddo/Enrollment custom-entity data model (documented in `docs/espocrm-data-model.md`). Wrote up `docs/HANDOFF.md` at the end of the session to capture all of this before it went stale.

## 2026-08-12 session detail

- Added baseline security hardening: `public/.well-known/security.txt` (RFC 9116) and `public/.htaccess` with an HTTPS redirect, HSTS, and a CSP audited against actual embeds (Google Maps + YouTube-nocookie). Also fixed a real incident in the same commit: the CI deploy's rsync `--exclude` list was missing `crm/`, so `--delete` had been wiping the live EspoCRM install on every deploy.
- Homepage hero/enrollment tweaks: dropped the hero badge (folded its copy into the Welcome section as an intro line instead), centered the "How to Enroll" step cards on mobile.
- Added `ApproachTeaser`, a bento-grid homepage section linking to anchored sections on `/our-approach` (added stable `id`s to all 8 Feature10 theme sections for this); gave the Welcome section its own full-bleed green-900 background.
- Fixed `Footer3`'s link-columns grid to size to the actual column count instead of always reserving 3 (was leaving a large empty gap on the enrolled portal, which only had 1 column at the time).
- Styled the Welcome section's tagline as an accent-bordered italic blockquote; centered it and the Programs/ApproachTeaser section intros to match how How to Enroll / Request a Tour already rendered.

## 2026-08-13 session detail

The big one - most of a full workday, almost entirely on the enrolled-student portal and a sitewide production bug.

- Forked `WelcomeMessage` into two independent components - `WelcomeHomepage` (homepage, copy unchanged) and `WelcomeEnrolled` (enrolled portal, own photo + copy) - instead of one shared component threading props through both.
- Migrated Starwind UI to v3 (confirmed low-risk first: `starwind migrate` reported the project was already on the Runtime-based config, so nothing needed converting) and installed the free `@starwind-pro/login-01` block for a "sign in" popover in the main site's footer. Iterated through several UI directions per feedback before landing on the final one: a Sheet (slide-in drawer) was tried and rejected for feeling too heavy, replaced with a Popover (fade/zoom, anchored to the trigger button) instead. Added a global `prefers-reduced-motion` CSS rule while in there, since the animation library in use didn't respect it.
- Replaced the footer's Privacy Policy/Terms/Attributions links with an accessibility statement (mailto link, no visible email address per a standing preference against exposing raw contact info on the site).
- Rebuilt `/enrolled-students` from a single hardcoded calendar page into a full portal hub: added `ResourcesPreview` (bento layout, 2 image cards using cached `og:image`s + 2 icon cards, plus a 5th full-width card added mid-session), `HandbooksPreview` and `FormsPreview` (Programs-card-style teasers linking to the real pages), and a `TuitionRates` section (Sprouts/Preschool tabs plus a separate Summer Camp rates block with real per-group weekly pricing). Went through several rounds of copy/spacing/heading-level iteration on the tuition section in particular, including a heading-hierarchy fix for accessibility (wrapped "Tuition Information" and "Summer Camp" under one shared, screen-reader-only `h2` "Tuition" instead of two disconnected top-level headings).
- Wired all four enrolled-portal nav items (Forms, Handbooks, Tuition, Resources) to anchor-link straight to their preview sections on the hub page instead of dropdown menus or standalone pages.
- Replaced the hardcoded calendar `<dl>` block with a proper `calendarEvents` Astro content collection (`src/content.config.ts` + `src/data/calendar-events.yaml`, one entry per event) rendered as a scrollable, programmatically-sorted/grouped list, side by side with a native Google Calendar iframe embed (`hello@wildpear.school`). Caught and fixed a real content bug in the process: the last entry's "July 2025" section heading was actually July 2026 (positioned after that school year's June 2026 events).
- Removed a gradient-clip-text effect from the homepage h1 (was fading to 70% opacity, reading dimmer than the surrounding solid-white UI).
- **Diagnosed and fixed a sitewide production bug**: the login form worked locally but not in production; traced it to the production CSP (`script-src 'self'`, no `unsafe-inline`) silently blocking Astro's default behavior of keeping single-use component `<script>` tags inline in the built HTML. First fix attempt (dropping `define:vars`) didn't actually work - confirmed via the live site that Astro inlines these regardless. Real fix: extract to `public/scripts/*.js` + `<script is:inline src="...">`, which is the only way to get Astro to emit the tag completely untouched. Once the pattern was confirmed, audited every built page for the same issue and found 7 more affected components - notably `Navbar4`'s scroll/reveal script, which explained a second bug report ("navbar disappeared on the homepage / lost its background on the enrolled portal") as the same root cause, not a separate issue. Also fixed the login's shared password and its redirect target (was a relative path resolving to the wrong domain instead of `enrolled.wildpear.school`), and a related deploy bug where the new `public/scripts/` directory had been silently dropped by `split-deploy.mjs`'s asset allowlist (same failure class as the `crm/` rsync-exclude incident from 08-12).
- Allowed `https` images in the CSP and reformatted the CSP header for readability; bumped the global `h2` size to match `h1`'s scale and raised the `lg` breakpoint's `h1` size to `4rem`; shrunk the homepage hero buttons and simplified its heading classes.

## 2026-08-14 session detail

- Added a reCAPTCHA v2 checkbox to the contact form (`form-contactus.astro`) and prepped the client JS for server-side verification.
- Wired the contact form to a live n8n webhook (`https://n8n.wildpear.school/webhook/contact-form`) for reCAPTCHA verification - built and imported `n8n/contact-form-recaptcha-verify.json` (webhook -> Google `siteverify` -> success/failure branch).
- Pre-filled the contact form's phone fields and tweaked the contact-us question label copy.
- Passed `PUBLIC_RECAPTCHA_SITE_KEY` into the production build.

## 2026-08-15 session detail

- Set `RECAPTCHA_SECRET_KEY` in `/docker/n8n/.env` on the Hostinger VPS running n8n (moved there from a since-abandoned Oracle Cloud VM plan - see `docs/enrollment-form-plan.md` and `docs/HANDOFF.md` for why) and restarted the n8n container to pick it up.
- Fixed the contact form's message-field label: was still the placeholder "Why 42?", changed to "We will try our best to answer your question."
- Investigated a live bug: contact form submissions show a generic "Something went wrong sending your message" error even with the captcha solved. Confirmed via curl and the live n8n editor that the workflow itself is correctly wired (both success and failure branches exist and respond); root cause still open, tracked in `TODO.md` and `docs/HANDOFF.md` - next step is checking the actual "Verify reCAPTCHA" node output in n8n's Executions tab for Google's `error-codes`.
- Confirmed the contact form's n8n success branch doesn't deliver the message anywhere yet (no EspoCRM record, no email) - scoped as the next task once the bug above is resolved.

## 2026-08-19 session detail

- Added a coming-soon parking page (`src/pages/coming-soon.astro`) and a `PARKING_MODE` deploy toggle (repo variable or manual `workflow_dispatch` input) so the whole site can be swapped to a placeholder without touching the built site; used it a few times over the course of the session to take the live site down for testing and back up again.
- **Fixed the contact form's reCAPTCHA verification** (the bug flagged 2026-08-15) - root cause was three stacked issues found by inspecting live n8n Executions: the "Verify reCAPTCHA" node's body was in a broken/orphaned mode sending no body at all; the site had a v2/v3 key mismatch; and Google's `siteverify` endpoint needs `application/x-www-form-urlencoded`, not JSON. Also switched the site from reCAPTCHA v2 (checkbox) to v3 (invisible, score-based) with a freshly-registered key pair, which turned out to be Enterprise-backed - had to enable the reCAPTCHA Enterprise API on the associated Google Cloud project before verification would succeed. Confirmed working end-to-end with a real submission (`success: true, score: 0.9`).
- Added a thank-you confirmation panel to the contact form that replaces the form on successful submission, instead of just an inline success line.
- Updated `TODO.md` and `docs/HANDOFF.md` to reflect the fix and to correct stale SMTP status - SMTP for EspoCRM (Quire #45) was actually configured this session too (`hello@`, `system@`, `susan@`, `jeannie@` @wildpear.school mailboxes), which hadn't made it into the docs yet. Logged the work in Quire (#107 fix, #108 tomorrow's EspoCRM-delivery plan).
