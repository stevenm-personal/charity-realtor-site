# Design audit — status

Punch list from the pre-launch design/repository audit (Claude Code, 2026-08-19). This is a status tracker, not a standing reference — update it as items move, and delete it once everything is resolved or intentionally deferred past launch. It does not replace `BRAND.md`, `AGENTS.md`, or the other reference docs; those remain authoritative for how things should be done.

Status values: **done** · **declined** · **not started**

| # | Recommendation | Priority | Effort | Status | Notes |
|---|---|---|---|---|---|
| 1 | Deepen the Wichita community page (and even out Goddard/Maize); Wichita is the top-priority local-search page but currently the thinnest (362 words, 3 images) | High | Large | not started | Content work, not code. Highest business-value item — Wichita ranking is the stated #1 goal. |
| 2 | Self-host Inter instead of relying on each visitor's system-font fallback | High | Small | **done** | Added `@fontsource-variable/inter`; `tokens.css` `--font-body` now leads with `"Inter Variable"`; `@import` added in `global.css`. Verified in build output (`dist/_astro/inter-*.woff2`). |
| 3 | Widen background contrast between parchment/surface/sage tokens (measured 1.10–1.24:1, functionally invisible) | High | Small | **declined** | Reviewed via a side-by-side comparison artifact (real Wichita-page copy, toggleable current/proposed). User reviewed and prefers the current values. Keep as-is; don't re-propose without new input. |
| 4 | Replace the AI-generated homepage hero image with real Kansas photography | High | Small* | not started | Known placeholder per user. *Effort is sourcing the photo, not code. |
| 5 | Cut interior-page hero heights (~⅓ shorter) and reduce h1 clamp sizes | High | Medium | **done** | `global.css`: `.page-hero`, `.page-hero-content h1`, `.buying-page/.selling-page/.land-roadmap-page .page-hero`, `.page-hero-about-grid` (both breakpoints) all reduced. |
| 6 | Fix the footer logo row (off-palette bright orange / black+cyan / white squares on espresso) | High | Small–Med | not started | Needs transparent/reversed logo assets or a light "plate" treatment; depends on asset availability. |
| 7 | Give the copper accent a real role — primary CTA buttons currently always render espresso | High | Small | not started | e.g. `.closing-cta` button, contact submit button. |
| 8 | Mobile fixes bundle: `.service-card` min-height forced on mobile (133px content in 361px card), footer link touch targets (17px, need ≥44px), header brand-name clipping at 320–390px, `.registration-mark` scoped only to `≥48rem` | High | Small | not started | Four small, unrelated CSS fixes — grouped because they're all quick mobile-QA items. |
| 9 | Fix `.closing-cta` body-copy contrast (74% white on olive = 3.53:1, fails WCAG AA) | Medium-High | Small | not started | Raise `--color-text-on-dark-muted` alpha or darken `--color-primary` slightly. |
| 10 | Remove phantom 32px seam after `.communities-home` + dead `.service-card:nth-child(2)` stagger (overridden by reveal system, never renders) | Medium | Small | not started | `global.css`; `.services-home + * { margin-bottom: 2rem }` is compensating for a transform that never applies. |
| 11 | Break the community-page template on Wichita and Valley Center so all 8 pages don't read as siblings | Medium | Medium | not started | Content/structure work; depends on #1. |
| 12 | Vary or reduce scroll-reveal choreography (22 reveals/page on community pages, alternating left/right 7×); also `right-scale` variant used but undefined in CSS | Medium | Medium | not started | Optional polish. |
| 13 | Add imagery to service pages (Buying/Selling/Land & Acreage/Services router currently have zero images; unused Kansas land photos exist in `src/assets/shared/kansas/`) | Medium | Small | not started | |
| 14 | Extract a reusable blog article system before post #3 (`blog.css` is 570 lines bound to one article's bespoke classes) | Medium | Medium | not started | Do before writing the next blog post, not urgent now. |
| 15 | Delete dead CSS (`.header-affiliations`, `.empty-editorial`, `.step-grid`, `.topic-grid`, `.photo-story-secondary`, `.service-note`, `.legal-placeholder`), unused tokens (`--color-secondary`, `--color-field`, etc.), and unused image assets (10 files in `src/assets/`) | Low | Small | not started | Optional cleanup. |
| 16 | Fix unclosed `<span>` markup bugs in `Header.astro` (`.brand-title`) and `Footer.astro` (`.footer-name`) | Medium | Small | not started | Footer bug has a visible consequence: `.footer-role`/`.footer-license` inherit Georgia instead of the intended body sans, and `.footer-identity`'s `gap` never applies since it ends up with only one grid child. Header version is currently harmless (renders correctly by luck) but fragile. |

## Deferred out of scope for this audit

Per the original audit brief, these were explicitly excluded and are tracked elsewhere (`SEO.md`, `README.md`, `IMAGE_RIGHTS.md`): image copyright/final image swaps, production contact-recipient cutover, DNS/domain launch, removing `noindex`, sitemap/canonical/Search Console/GA4/Cloudflare Analytics, production SEO, legal sufficiency of Privacy/Disclaimer, brokerage compliance research.
