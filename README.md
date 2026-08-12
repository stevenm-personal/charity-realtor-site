# charity-realtor-site

Static Astro website for Charity Menefee Real Estate.

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

The Astro site remains fully static. A small Cloudflare Worker at `worker/index.js` handles only `POST /api/contact`; all normal pages and assets continue to be served from `dist/` by Workers Static Assets.

The endpoint validates and normalizes the submitted fields, checks a hidden honeypot, verifies Cloudflare Turnstile server-side, and sends one plain-text notification through the `EMAIL` binding. The expected sender is `website@charitymenefee.com`, and the visitor's email is used only as Reply-To. Submissions are not stored in a database.

> **Temporary testing configuration:** Form notifications currently go to `stevenm621844@yahoo.com`. Before production launch, change both the Worker recipient and the restricted `send_email` destination to the intended production recipient, `charity@curtiscrewict.com`, then repeat the end-to-end delivery test. Charity's publicly displayed contact email remains `charity@curtiscrewict.com` throughout development.

Required configuration:

1. Create a Turnstile widget for the deployed hostnames. Put its public site key in a local `.env` file as `PUBLIC_TURNSTILE_SITE_KEY` before running the Astro build. Use Cloudflare's official Turnstile test site key for local testing.
2. Add the matching private Turnstile key to the Worker as the `TURNSTILE_SECRET` secret. For local Wrangler testing, put a Turnstile test secret in the ignored `.dev.vars` file. Never commit either real secret.
3. In Cloudflare Email Service, verify the current testing destination, `stevenm621844@yahoo.com`. Before launch, verify `charity@curtiscrewict.com` and restore it as the Worker and binding destination.
4. Onboard `charitymenefee.com` for Email Sending so `website@charitymenefee.com` is an allowed sender. Cloudflare's sending setup uses records on its `cf-bounce` subdomain and is separate from inbound Email Routing. Do not replace existing root-domain MX records for this form.
5. Keep the `EMAIL` binding restrictions in `wrangler.jsonc`. They limit the Worker to the verified recipient and sender above.

The development warning on the Contact page should remain until the production Turnstile keys, verified destination, sending domain, and an end-to-end email test have all been completed.
