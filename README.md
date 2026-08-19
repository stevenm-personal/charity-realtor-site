# charity-realtor-site

Static Astro website for Charity Menefee Real Estate. GitHub is the source of truth for the project.

## Architecture

- Astro with static output.
- npm for dependency and script management.
- Cloudflare Workers Static Assets serves the generated `dist/` site.
- One narrowly scoped Cloudflare Worker handles `POST /api/contact`.
- All non-API routes remain static assets.
- No React, Tailwind, CMS, database, CRM, or unnecessary runtime framework.

The Contact Worker is an approved exception to the static-first architecture. Do not expand the site into a general Worker application or add server-side behavior without a concrete need.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

The generated static site is written to `dist/`.

## Contact form

The current flow is:

```text
Visitor Contact form
-> Cloudflare Turnstile
-> POST /api/contact
-> small Cloudflare Worker
-> server-side validation
-> Cloudflare email binding
-> verified destination email
-> optional generic Pushover alert scheduled in the background
```

The form requires Name, Email, and Message. Phone is optional. Message length is limited to 3 through 5000 characters. The Worker normalizes and validates the submission, checks a hidden honeypot, and verifies the Turnstile token, `contact` action, and approved site hostname through server-side Siteverify before sending one plain-text email. The visitor's validated email becomes Reply-To. The sender and recipient remain fixed server-side, and the Cloudflare binding restricts the permitted destination and sender.

After the email succeeds, the Worker uses `ctx.waitUntil()` to schedule an optional Pushover lead alert. Configure `PUSHOVER_APP_TOKEN` and `PUSHOVER_USER_KEY` as private Worker runtime secrets. The user key may identify an individual account or a Pushover Delivery Group. Pushover receives only the generic notification `New website lead` with the message `A new contact form message was received. Check your email for the details.` Visitor-submitted names, email addresses, phone numbers, messages, IP addresses, and verification data are not sent to Pushover. Missing Pushover configuration or a notification failure does not change a successful Contact submission because the email remains the authoritative lead record.

The client provides sending, success, verification-error, and delivery-error states. A confirmed successful submission displays `Message sent!`. Turnstile uses Managed mode with `interaction-only` appearance. The earlier Contact-page development warning was intentionally removed after the deployed development site completed a successful end-to-end email-delivery test.

Submissions are not intentionally stored. The site has no database or CRM.

### Turnstile configuration

- `PUBLIC_TURNSTILE_SITE_KEY` is public and required when Astro builds the site. Configure it as a Cloudflare build variable for deployed builds. Local development may provide it through an ignored `.env` file. If it is missing, the Contact page intentionally renders without a usable Turnstile widget and disables `Send Message`.
- `TURNSTILE_SECRET` is private and is available only to the Worker at runtime. Configure it as a Cloudflare Worker secret. Local Wrangler testing may provide a test secret through ignored `.dev.vars`. Never commit, print, request, or expose the secret client-side.

The public site key is a required production-build prerequisite. The deployed development configuration has already passed an end-to-end Turnstile, Worker, email-delivery, and Reply-To test.

### Cloudflare Email Routing configuration

The working development setup uses Cloudflare Email Routing for `charitymenefee.com`, the Worker's `send_email` binding, and a verified destination address. It does not use the Workers Paid Email Sending onboarding path.

The previous external SiteGround MX records were intentionally replaced because nobody currently uses an `@charitymenefee.com` mailbox. Do not restore or preserve those old MX records unless the email requirements change and the replacement is deliberately reviewed.

The current fixed sender is `website@charitymenefee.com`.

> **Current temporary testing configuration:** Contact-form notifications go to the verified destination `stevenm621844@yahoo.com`. Keep this testing recipient in place during development. Charity's public contact email remains `charity@curtiscrewict.com`.

Before production launch:

1. Verify `charity@curtiscrewict.com` as a destination in Cloudflare Email Routing.
2. Change the Worker recipient from `stevenm621844@yahoo.com` to `charity@curtiscrewict.com`.
3. Change the restricted `send_email` destination in `wrangler.jsonc` at the same time.
4. Update the related recipient test and this documentation.
5. Repeat end-to-end delivery and Reply-To testing.

Do not change the temporary Yahoo recipient before that coordinated launch task.

## Current development state

- The site remains globally `noindex, nofollow`.
- The temporary Yahoo destination remains active for form testing.
- `https://charitymenefee.com/` is the intended production domain but is not yet fully launched.
- Privacy and Disclaimer contain working draft content and still require final human/brokerage review before launch.
- The Blog may remain empty until genuinely useful articles are ready.
- Analytics has not been selected or configured.

Treat these as explicit launch checklist items rather than accidental implementation errors. Follow `SEO.md` for the dedicated production indexing and canonical-domain pass.
