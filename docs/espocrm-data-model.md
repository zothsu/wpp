# EspoCRM Data Model: Kiddo + Enrollment

Source of truth for the custom entity design decided in chat on 2026-08-11, so
building this out in EspoCRM's Admin panel (and the n8n field-mapping in
`docs/enrollment-form-plan.md`) doesn't require re-deriving it. Mirrors the
fields actually collected by `EnrollmentSummerForm.astro` and
`EnrollmentSproutsForm.astro`, which are otherwise identical apart from the
program-specific fields noted below.

## Entity: Kiddo

One record per child, persists across years and programs - a family with
multiple kids, or a kid enrolling in both Sprouts and later Summer Camp, gets
one Kiddo record each, not one per submission.

| Field | Type | Notes |
| :--- | :--- | :--- |
| Name | Text | |
| Date of Birth | Date | |
| Nickname | Text | Optional |
| Pronouns | Text | Optional |
| Grade | Enum | Sprout, Walker/Crawler, Kindergarten, 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, Other - covers every program from Sprouts (infant/toddler) through Camp Counselor |
| Age | Formula | `datetime\diff(datetime\today(), dob, 'years')` - calculated from Date of Birth, recalculates on save (not live) |
| Health Concerns | MultiEnum | Food Allergy, Insect Sting, Asthma, Seizures, ADHD/ADD, Other |
| Health Concerns Details | Text | Optional |
| Insurance Provider | Text | Optional |
| Physician Name | Text | Optional |
| Physician Office | Text | Optional |
| Physician Phone | Phone | Optional |
| Primary Guardian | Link → Contact | |
| Secondary Guardian | Link → Contact | Optional |
| Emergency Contact Name | Text | Embedded, not a Contact link - rarely someone the school has an ongoing relationship with |
| Emergency Contact Relationship | Text | |
| Emergency Contact Phone | Phone | |
| Emergency Contact Email | Email | Optional |

## Entity: Enrollment

One record per submitted enrollment form. Links back to a Kiddo - the
per-submission process/paperwork state, not the child's identity data.

| Field | Type | Notes |
| :--- | :--- | :--- |
| Kiddo | Link → Kiddo | |
| Program | Enum | Summer Camp, Sprouts, Camp Counselor |
| Status | Enum | New Inquiry → Tour Scheduled → Tour Completed → Application Submitted → Under Review → Waitlisted → Enrolled → Declined. Covers the whole funnel, not just post-submission - see the open item below about feeding tour requests in at the top of this funnel. |
| Tour Date | Date | Optional |
| Agree: Handbook | Bool | 11 individual booleans, not one combined field - keeps a clean audit trail of exactly what was agreed to given the medical/liability content |
| Agree: Slot Reservation | Bool | |
| Agree: Drop-off Time | Bool | |
| Agree: Pickup Time/Late Fee | Bool | |
| Agree: Multi-Program Enrollment | Bool | |
| Agree: Field Trips | Bool | |
| Agree: Photo/Video | Bool | |
| Agree: Health Policy | Bool | |
| Agree: Immunizations | Bool | |
| Agree: Keep Home When Sick | Bool | |
| Agree: Emergency Care | Bool | |
| Signature Name | Text | |
| Signature Date | Date | |

## Open items

- The "Request a Tour" form (`ScheduleTour.astro` / `form-tourRequest.astro`)
  is an earlier funnel touchpoint than the two full enrollment forms and
  should eventually also create/update a Kiddo + Enrollment record (at "New
  Inquiry" or "Tour Scheduled"), so the funnel is tracked end-to-end instead
  of only from application onward. Tracked as a separate task - not required
  before the two main enrollment forms go live.
