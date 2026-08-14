# To-Do

- [ ] Reconcile enrollment step order: the "How to Enroll" 3-step timeline (Enrollment.astro) says Learn -> Tour -> Application (application comes after the tour). The detailed policy text on `/enrollment-information` says the formal order is Application (with $20 fee) -> Tour -> Enrollment offer (application comes before the tour). Decide which is accurate and update the other.
- [ ] Build the `/forms` hub page. It still 404s - the enrolled portal's footer "Forms" link and nothing else point to it. (Note: the enrolled portal *nav's* "Forms" item was changed to anchor-link straight to the Forms preview section on `/enrolled-students` instead, so this hub page is now only reachable via that one footer link.)
- [ ] Reformat `/enrollment-information` page: needs centering and rewording of copy.
- [ ] Navbar: active/current page link should render in the accent color, not the default muted-foreground style.
- [ ] Add a real SignUpGenius (or similar) link to the enrolled portal's Summer Camp rates section so families can see live slot availability - the per-group weekly rates are there, but the live "X of Y slots filled" counts aren't (deliberately not hardcoded, since that data goes stale immediately). URL not yet provided.
- [ ] The new Wild Pear Google Calendar (`hello@wildpear.school`, embedded on the enrolled portal via `CalendarSection.astro`) is currently empty - the embed will show nothing until events are actually added to it. The scrollable list next to it is separate, hand-maintained data (`src/data/calendar-events.yaml`) and already has the 2025-2026 school year dates.
- [ ] Summer camp enrollment form (`/forms/enrollment-summer`) and Sprouts enrollment form (`/forms/enrollment-sprouts`) both have stubbed submits (log to console, no backend). Wiring them up to n8n/EspoCRM and picking a signature method is tracked in [`docs/enrollment-form-plan.md`](docs/enrollment-form-plan.md).

## Photos needing replacement

- [ ] `/our-approach` FAQ section (`temp1.jpg`) — unlicensed iStock preview image (visible "Credit: cienpies" watermark), used as a placeholder for the Feature8 question-marks graphic.
- [ ] `/our-approach` "Our Approach to Learning" now has 8 themes (added "Caring for Animals and Growing Food" using the real `img_2982.webp` chicken photo). 6 of 8 themes have real photos. Anti-Bias Mindset is **temporarily** using an unlicensed Dreamstime preview (`world-children-10847851.jpg`, asset ID 10847851, contributor Mitch1921, visible watermark) for internal review only — before this goes live, either buy the Dreamstime license for that asset ID or swap in a free/real photo instead.
