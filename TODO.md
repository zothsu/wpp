# To-Do

- [ ] Reformat `/programs` page alignment to right OR center, not both
- [ ] Reconcile enrollment step order: the "How to Enroll" 3-step timeline (Enrollment.astro) says Learn -> Tour -> Application (application comes after the tour). The detailed policy text on `/enrollment-information` says the formal order is Application (with $20 fee) -> Tour -> Enrollment offer (application comes before the tour). Decide which is accurate and update the other.
- [ ] Build the `/forms` hub page linked from the footer that currently 404s. (`/forms/enrollment-summer` and `/forms/enrollment-sprouts` are built; `/resources` is now built and linked directly from the nav; the old Videos/Tax Info dropdown items were removed since we didn't need them.)
- [ ] Reformat `/enrollment-information` page: needs centering and rewording of copy.
- [ ] Navbar: active/current page link should render in the accent color, not the default muted-foreground style.
- [ ] `Enrollment.astro` "Submit Your Application" step has a placeholder `href="#"` — swap in the real application form URL once it's ready.
- [ ] Summer camp enrollment form (`/forms/enrollment-summer`) and Sprouts enrollment form (`/forms/enrollment-sprouts`) both have stubbed submits (log to console, no backend). Wiring them up to n8n/EspoCRM and picking a signature method is tracked in [`docs/enrollment-form-plan.md`](docs/enrollment-form-plan.md).

## Photos needing replacement

- [ ] `/our-approach` FAQ section (`temp1.jpg`) — unlicensed iStock preview image (visible "Credit: cienpies" watermark), used as a placeholder for the Feature8 question-marks graphic.
- [ ] `/our-approach` "Our Approach to Learning" 7-theme section (Feature10) — 6 of 7 themes now have real photos (Emotional Safety, Ability to Clearly Communicate, Ability to Care for Oneself, Social Skills, Executive Functioning, Enjoyment of Being Outside). Still need a real Wild Pear photo for Anti-Bias Mindset (still on the `temp1.jpg` placeholder). `public/images/img_2982.webp` (chickens) is unused and available if it fits.
