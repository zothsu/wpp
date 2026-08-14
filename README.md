# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🗺️ Sitemap

The site splits into two portals at **deploy time** (see `scripts/split-deploy.mjs`,
run by `.github/workflows/deploy.yml` on every push to `main`): the same Astro
build produces both, and the routes below are divided out to two separate
Hostinger subdomains/document roots. There are no cross-portal links between
them other than the enrolled-portal login (a shared-password gate, client-side
only — see `src/components/starwind-pro/login-01/Login1.astro`) in the main
site's footer, which redirects to `https://enrolled.wildpear.school/`.

### `wildpear.school` (main / prospective-family site)

| Route                       | Page                                | Notes                                          |
| :--------------------------- | :------------------------------------ | :----------------------------------------------- |
| `/`                          | Home                                  | Hero + Welcome + How to Enroll + Programs + Approach teaser + Schedule a Tour form. `/learn-about-us` was merged into this page (2026-08-11) — that route no longer exists. |
| `/our-approach`              | Our Approach                          |                                                 |
| `/who-we-are`                | Who We Are                            |                                                 |
| `/programs/infant-toddler`   | Infant/Toddler program detail         | ServicePage6                                   |
| `/programs/preschool`        | Preschool program detail              | ServicePage6                                   |
| `/programs/summer-camp`      | School Age Summer Camp detail         | ServicePage6                                   |
| `/enrollment-information`    | Enrollment Information                |                                                 |
| `/contact`                   | Contact                               |                                                 |
| `/privacy`, `/terms`, `/attributions` | Legal pages                | Duplicated onto both portals (see `sharedPages` in `split-deploy.mjs`) |

### `enrolled.wildpear.school` (enrolled-family portal)

| Route                       | Page                                | Notes                                          |
| :--------------------------- | :------------------------------------ | :----------------------------------------------- |
| `/` (built from `/enrolled-students`) | Enrolled portal hub          | Welcome + `CalendarSection` (content-collection event list + Google Calendar embed, side by side) + Resources/Tuition/Handbooks/Forms preview sections, each anchor-linked from the nav |
| `/tuition`                   | Tuition                               | Full rate tables (`TuitionRates`), also embedded as a preview on the portal hub |
| `/handbooks`                 | Family Handbooks hub                  |                                                 |
| `/handbooks/family`          | Family Handbook                       |                                                 |
| `/handbooks/preschool`       | Preschool Handbook                    |                                                 |
| `/handbooks/infant-toddler`  | Infant & Toddler (Sprouts) Handbook   |                                                 |
| `/handbooks/summer-camp`     | School Age Summer Camp Handbook       |                                                 |
| `/resources`                 | Resources link directory              | Auto-fetches each external link's `og:image` at build time (`src/lib/utils/ogImage.ts`), caches to `src/data/og-image-cache.json` |
| `/forms/enrollment-summer`   | Summer Camp Enrollment Form           | Multi-step form, stubbed submit — see [`docs/enrollment-form-plan.md`](docs/enrollment-form-plan.md) |
| `/forms/enrollment-sprouts`  | Sprouts Enrollment Form               | Multi-step form for infants/toddlers, stubbed submit |
| `/privacy`, `/terms`, `/attributions` | Legal pages                | Same shared pages as the main portal |

### A note on `<script>` tags

Astro keeps single-use component `<script>` blocks **inline** in the built
HTML by default — this includes plain `<script>` tags, not just ones using
`define:vars`. The production CSP (`public/.htaccess`, `script-src 'self'`,
no `unsafe-inline`) silently blocks every inline script. If you add
interactive JS to a component and it works in `astro dev` but does nothing in
production, this is almost certainly why. Fix: move the script's logic to a
plain file in `public/scripts/*.js` (stripping any TypeScript-only syntax —
`as X` casts, `querySelector<T>` generics — since it won't be processed
through Astro/esbuild anymore) and reference it with
`<script is:inline src="/scripts/your-file.js">`. `is:inline` is required —
without it, Astro still intercepts even a `src`-attributed tag and rewrites
it to its own virtual module URL. See any of the files under
`public/scripts/` for a working example, and the 2026-08-13 commits
("Fix every remaining CSP-blocked inline script sitewide") for the full
writeup of how this was found.

### Homepage hero — headline options

The homepage hero (`HeroMain`, forked from Starwind's Hero11 — see "Things worth knowing" in `docs/HANDOFF.md` for why) currently uses **"Rooted in nature, ready for the world."** Other options brainstormed for this spot (theme: baby-led care, emotional intelligence, outdoor play, play builds the brain), kept here so they aren't lost:

1. Rooted in nature, ready for the world *(in use)*
2. Where little ones lead, and we follow
3. Growing minds, one adventure at a time
4. Nurturing how they feel, not just what they know
5. Outside isn't a break from learning — it is the learning
6. Play is how the brain builds itself
7. Baby-led care for a bigger, braver world
8. Every child's pace is the right pace here
9. Feelings first, foundations for life
10. Muddy hands, growing minds
11. Following your child's lead, every step of the way
12. Where curiosity gets to run outside

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
