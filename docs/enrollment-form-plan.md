# Summer Enrollment Form: Plan

Replaces `form-enrolment-summer.pdf` with a web form. Source of truth for the
architecture decisions made in chat on 2026-08-09, so a future session (or
collaborator) doesn't have to re-derive them.

## Architecture

```
Astro static form (this repo)
  -> client-side fetch() POST to an n8n Webhook
       n8n, self-hosted on Oracle Cloud Always Free VM (Docker)
       -> HTTP Request node -> EspoCRM REST API
            EspoCRM, self-hosted on Hostinger Business hosting (LAMP)
            (source of truth for family/contact records)
```

Why split across two hosts: EspoCRM is a PHP+MySQL app, so it runs fine on
Hostinger Business shared hosting (SSH, cron jobs, choice of PHP version all
available there). n8n is a long-running Node.js process that needs to stay up
listening for webhooks, shared hosting can't run that, hence Oracle Cloud's
free-tier VM (which does support Docker/persistent processes). The two talk
over plain HTTPS + API key, so which host each lives on doesn't matter to the
integration.

Everything above is free/open-source software; the only real cost is hosting,
and both hosts are already free tiers/plans the user has.

## Signature capture (decision deferred)

Two options on the table, not yet chosen:

- **DIY canvas pad** (`signature_pad`, MIT license): simplest, ships with the
  rest of the form payload as an image. Legally fine for this use case
  (ESIGN/UETA) as long as timestamp/IP/typed name/certification checkbox are
  logged alongside it, but no formal audit trail.
- **Documenso**: self-hosted, open-source DocuSign alternative (AGPL). Closer
  to a "real" e-signature ceremony with a proper audit trail and a generated
  signed PDF, but it's another service to host and requires building a PDF
  template.

DocuSign itself was ruled out: its free tier (3 envelopes/month, personal use)
doesn't fit a real enrollment workflow, and it isn't open source.

## Status

The Astro form is being built first with a **stubbed submit** (logs to
console / no-op), independent of the backend. The webhook URL gets swapped in
once n8n is live. See the todo list for sequencing.

## reCAPTCHA (2026-08-14)

Not part of this form, but the same webhook pattern: the **contact form**
(`src/components/form-contactus.astro`) now has a reCAPTCHA v2 checkbox,
wired client-side only, ahead of n8n existing.

- Keys in `.env.local`: `PUBLIC_RECAPTCHA_SITE_KEY` (used client-side,
  first `import.meta.env` usage in this repo) and `RECAPTCHA_SECRET_KEY`
  (unused for now - no server here to verify it).
- `public/scripts/contact-us-form.js` blocks the stub submit until the
  widget is solved.
- `public/.htaccess` CSP opened up for `google.com`/`gstatic.com`/
  `recaptcha.google.com`.
- `n8n/contact-form-recaptcha-verify.json`: ready-to-import workflow
  (webhook -> Google `siteverify` -> success/failure branch). Success
  branch just returns 200 for now; actually delivering the message (email
  and/or EspoCRM record) isn't built yet.

Remaining once n8n exists: point the contact form's stub `fetch()` at the
real webhook, and import the workflow above.
