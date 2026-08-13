import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

const calendarEvents = defineCollection({
  loader: file("src/data/calendar-events.yaml"),
  schema: z.object({
    id: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    /** Overrides the programmatically-formatted date (e.g. "TBD") */
    dateDisplay: z.string().optional(),
    label: z.string(),
  }),
});

export const collections = { calendarEvents };
