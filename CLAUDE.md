# CLAUDE.md

Static Astro website for Charity Menefee Real Estate (Wichita, KS area). Pre-launch — see "Current state" below.

## Architecture

- Astro, static output only. npm for scripts/dependencies. GitHub is the source of truth.
- Deployed as static assets via Cloudflare Workers; one narrowly-scoped Worker (`worker/index.js`) handles `POST /api/contact` and is the *only* approved server-side exception. Do not add other server-side behavior, a CMS, a database, React, or Tailwind without an explicit approved need.
- Pages: `src/pages/` · Layouts: `src/layouts/` · Global styles/tokens: `src/styles/` (use `tokens.css` semantic variables, don't hard-code colors/spacing).
- Kansas Dusk is the site's current, implemented visual direction (not experimental, not branch-specific) — see `BRAND.md`.

## Commands

- `npm install` — install deps
- `npm run dev` — local dev server
- `npm run build` — production build; run after changes and fix any build errors introduced by your work
- `npm run preview` — preview the built output
- `npm run test:contact` — runs `tests/contact-worker.test.mjs` and `tests/contact-client.test.mjs` (Node test runner)
- `npm run deploy` — builds **and deploys to Cloudflare** (`wrangler deploy`). This is a real production action — never run it without the user explicitly asking in that session.

## Non-negotiable content rules (always apply, every page/component)

- Never invent testimonials, statistics, awards, credentials, license/brokerage details, contact info, MLS/market data, school claims, crime claims, demographics, or commute times. Use verified repo content or clearly-labeled placeholders.
- Fair Housing: never use protected-class or demographic proxies (e.g. "safe," "family-friendly," "ideal for retirees," "affluent"). Never steer or imply who belongs in an area.
- Default CTA is `Contact Me` unless a page has a genuinely contextual reason otherwise.

## Editorial voice (quick reference — full rules in BRAND.md)

- First person (`I`/`me`/`my`) for what Charity does/thinks; `you` for the visitor; collaborative `we` only when Charity and the client are genuinely doing something together. Never use `we`/`our` as an anonymous corporate narrator.
- Prioritize usefulness over conversion; avoid generic Realtor marketing language and manufactured urgency.

## Mobile-first (quick reference — full rules in BRAND.md)

Design and verify mobile first, then scale up. Verify representative phone/tablet/laptop/desktop widths before considering frontend work done. Respect `prefers-reduced-motion`.

## Read before doing this kind of work

| Task | Read first |
|---|---|
| Any visual/brand/editorial-voice/typography/color decision | `BRAND.md` |
| Creating or substantially editing a `src/pages/communities/*` page | `COMMUNITY_PAGES.md` + `BRAND.md` |
| Adding/verifying a time-sensitive local fact on a community page | `COMMUNITY_SOURCES.md` (and update it) |
| Creating a page, editing metadata/titles, writing a blog post, launch prep | `SEO.md` |
| Adding or crediting a third-party (non owner-supplied) photo | `IMAGE_RIGHTS.md` |
| Contact form / Turnstile / email-routing changes | `README.md` |
| Image asset placement (`src/assets/<category>/...` vs `public/`) | "Images and media" section of `AGENTS.md` |

## Current project state — do not "fix" these without being asked

- Site is intentionally `noindex, nofollow` site-wide. Do not remove this as a side effect of other work — it's a deliberate pre-launch, dedicated-pass action (see `SEO.md`).
- The contact form currently delivers to a **temporary test destination** configured in `wrangler.jsonc` and the Worker, not the real production recipient. Do not change this except as part of the explicit, coordinated launch task described in `README.md`.
- Privacy and Disclaimer contain working draft content and still require final human/brokerage review before launch; Blog is intentionally sparse until genuinely useful posts are ready; no analytics is configured yet.
