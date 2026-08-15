# Summer Enrollment Form: Plan

Replaces `form-enrolment-summer.pdf` with a web form. Source of truth for the
architecture decisions made in chat on 2026-08-09, so a future session (or
collaborator) doesn't have to re-derive them.

## Architecture

```
Astro static form (this repo)
  -> client-side fetch() POST to an n8n Webhook
       n8n, self-hosted on a Hostinger KVM 1 VPS (Docker Compose, n8n +
       Caddy for automatic HTTPS - see n8n/contact-form-recaptcha-verify.json)
       -> HTTP Request node -> EspoCRM REST API
            EspoCRM, self-hosted on Hostinger Business hosting (LAMP)
            (source of truth for family/contact records)
```

n8n was originally planned for an Oracle Cloud Always Free VM
(`VM.Standard.E2.1.Micro`, 1 OCPU/1GB RAM). That's abandoned as of
2026-08-15: it worked initially (Docker, Caddy, and a real Let's Encrypt cert
were all confirmed live) but became unresponsive after a reboot - 1GB RAM
wasn't enough for n8n + Caddy to restart simultaneously without pegging the
single CPU hard enough that even SSH stopped responding. Moved to a
Hostinger VPS instead (KVM 1, 4GB RAM - deployed and firewalled entirely via
the `hostinger-vps` MCP tools, no manual SSH/browser wizard needed), which
also keeps everything (site hosting, EspoCRM, now n8n) on one provider. This
is no longer free (a few $/month) but the Oracle box is gone, not idle.

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

## reCAPTCHA (2026-08-14, live as of 2026-08-15)

Not part of this form, but the same webhook pattern: the **contact form**
(`src/components/form-contactus.astro`) has a reCAPTCHA v2 checkbox and is
now fully wired end-to-end, not just client-side.

- Keys in `.env.local`: `PUBLIC_RECAPTCHA_SITE_KEY` (client-side) and
  `RECAPTCHA_SECRET_KEY` (set as an env var on the n8n host, read by the
  workflow's `siteverify` node - not used anywhere in this repo directly).
- `public/scripts/contact-us-form.js` posts the real form payload to
  `https://n8n.wildpear.school/webhook/contact-form` and shows a
  success/error message based on the response.
- `public/.htaccess` CSP: `script-src`/`frame-src` opened for
  `google.com`/`gstatic.com`/`recaptcha.google.com`, `connect-src` opened
  for `n8n.wildpear.school`.
- `n8n/contact-form-recaptcha-verify.json`: imported and **active** on the
  live n8n instance (webhook -> Google `siteverify` -> success/failure
  branch). Success branch still just returns 200 - actually delivering the
  message (email and/or EspoCRM record) isn't built yet, tracked
  separately (Quire #45, `docs/espocrm-data-model.md`).

Verified live: a POST with no `g-recaptcha-response` correctly returns
`400 {"success":false,"error":"reCAPTCHA verification failed"}`.
