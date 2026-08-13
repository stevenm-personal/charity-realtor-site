# Project rules for Codex

## Brand authority

- Read and follow `BRAND.md` before making visual, interaction, typography, color, photography, editorial-voice, or brand decisions.
- Treat `BRAND.md` as the authoritative design and editorial reference unless the user explicitly approves a change.
- Before creating or substantially editing any page under `src/pages/communities/`, read and follow `COMMUNITY_PAGES.md` in addition to `BRAND.md` and all rules in this file.
- Use semantic variables from `src/styles/tokens.css` instead of hard-coding repeated visual values in components.
- Update shared design decisions centrally in `src/styles/tokens.css` when appropriate, without over-engineering the token system.

## SEO authority

- Before creating a new page, substantially changing page content, editing metadata, writing or editing a blog post, creating or substantially editing a community page, or preparing the site for launch, read and follow `SEO.md`.
- Community-page work must follow both `SEO.md` and `COMMUNITY_PAGES.md` in addition to `BRAND.md` and all rules in this file.
- Preserve development `noindex` behavior unless the user explicitly authorizes a dedicated production-launch indexing change.

## Architecture

- Keep this site on Astro with static output.
- Use npm, keep GitHub as the source of truth, and deploy the static build through Cloudflare Workers Static Assets.
- Keep all non-API routes statically rendered and served from `dist/`.
- The existing narrowly scoped Cloudflare Worker for `POST /api/contact` is an explicitly approved architectural exception. Do not expand the site into a general Worker application or add new runtime/server-side behavior without a concrete, approved need.
- The Contact Worker may send an optional generic Pushover alert only after lead email delivery succeeds. Keep it non-critical through background execution, and never include visitor-submitted data in the alert.
- Do not add React, Tailwind, a CMS, a database, or another runtime framework.
- Prefer Astro components and plain CSS. Add client-side JavaScript only when a feature truly requires it.
- Keep dependencies minimal and explain why any new dependency is needed.

## Development

- Put pages in `src/pages/`, shared layouts in `src/layouts/`, and global styles in `src/styles/`.
- Build responsive, accessible interfaces with semantic HTML and visible keyboard focus states.
- Run `npm run build` after project changes and fix project-related build errors.
- Do not commit or push unless the user explicitly asks.

## Content integrity and Fair Housing

- Never invent testimonials, transaction statistics, awards, rankings, credentials, license details, brokerage disclosures, phone numbers, email addresses, social links, MLS data, market data, school claims, crime claims, demographics, or commute times.
- Use verified repository content or clearly labeled development placeholders when information is unavailable.
- Write community content for real visitors first. Each location page must contain genuinely useful, place-specific information rather than duplicated city-name substitutions.
- Do not describe communities with protected-class or demographic proxies, including claims such as safe, family-friendly, ideal for retirees, perfect for young professionals, Christian, or affluent.
- Keep community descriptions factual and avoid steering language. Do not make unsupported claims about schools, crime, demographics, or who belongs in an area.
- Do not present personal experience as a specialized professional credential unless that credential is verified.

## Editorial voice and point of view

- Treat the site as Charity Menefee's personal Realtor brand, not as brokerage or corporate copy describing one of its agents.
- When discussing Charity's experience, approach, services, opinions, or assistance, prefer first-person singular (`I`, `me`, and `my`) over third-person phrases such as "Charity can help" or generic corporate `we` language.
- Do not force first person into every page. Match the point of view to the content and follow the page-specific guidance in `BRAND.md`.
- On the homepage, address the visitor primarily as `you`, using first person selectively for Charity's role and approach.
- Write the About page in Charity's natural first-person voice.
- On Buying, Selling, and Land & Acreage pages, lead with useful visitor-focused information and use first person when Charity's involvement is relevant.
- Keep community-page body copy neutral, factual, and informational. Do not repeat service pitches through the guide; limit personal selling language to one restrained first-person invitation near the end when appropriate.
- Use a neutral editorial voice for informational blog content, allowing first person for genuine personal observations or firsthand experience.
- Use a conversational first-person voice on Contact and an appropriate neutral or formal voice for legal and disclosure content.
- Avoid corporate `we` or `our` unless the copy genuinely refers to Charity together with her brokerage or team. Personal use is appropriate only when the shared subject is clear, such as Charity speaking about her family; never use it as a generic corporate narrator.
- Prioritize usefulness before conversion, avoid generic Realtor marketing language, and do not add a sales pitch to every informational section.
- Treat low-pressure service as a brand behavior, not a catchphrase. Communicate it through calm, patient, straightforward copy instead of repeatedly saying `no pressure`, `low pressure`, `without pressure`, or similar phrases.
- Use `Contact Me` as the default primary visitor-facing CTA unless a page has a genuinely contextual reason to use different wording.
- Use natural contractions in visible site copy whenever they sound conversational and appropriate. Avoid unnecessarily formal constructions such as `do not`, `I will`, and `you are` when `don't`, `I'll`, and `you're` would sound more natural. Do not force contractions where they would be awkward, emphatic, legal, or otherwise inappropriate.
- Continue following every Fair Housing guardrail above; never introduce demographic assumptions, steering, protected-class language, or protected-class proxies while editing voice.

## Mobile-first responsive design

- Treat mobile responsiveness as a first-class requirement for every page and component.
- Design mobile layouts first, then progressively enhance them for tablet, laptop, and desktop widths.
- Do not build desktop layouts first and treat mobile as a cleanup phase.
- Implement responsive behavior while each component is being built instead of deferring it until the end.
- Provide navigation with a clear, accessible mobile pattern and comfortably sized controls.
- Scale typography, spacing, buttons, cards, images, forms, and content density appropriately across viewport sizes.
- Keep touch targets comfortably sized and spaced for mobile use; aim for at least `44px` by `44px` where practical.
- Prevent horizontal scrolling at normal viewport widths, including when using layered layouts or animated transforms.
- Keep hero sections readable, balanced, and visually strong on small screens.
- Use responsive sizing and Astro image optimization for large photographic assets where appropriate.
- Ensure scroll animations and interactive effects do not compromise usability, scrolling, or performance on mobile.
- Continue respecting `prefers-reduced-motion` for every animated or interactive effect.
- Before considering substantial page or component work complete, verify it at representative phone, tablet, laptop, and desktop widths.

## Images and media

- Prefer `src/assets/` for normal website photography so Astro can process and optimize it.
- Store brokerage and Realtor logos, team graphics, and other true brand assets in `src/assets/branding/`.
- Store Charity portraits and headshots in `src/assets/charity/`.
- Store homepage hero and homepage-specific photography in `src/assets/homepage/`.
- Store community photography in `src/assets/communities/<city>/`, using the matching city folder.
- Store each blog post's featured and inline images in `src/assets/blog/<post-slug>/`.
- Store images reused across multiple pages in `src/assets/shared/`.
- Use `public/images/static/` only for assets that must be served unchanged and do not need Astro image optimization.
- Store downloadable files such as PDFs in `public/files/`.
- Use Astro's image optimization pipeline for large photographic assets when appropriate.
- Provide responsive image sizing for hero and content photography.
- Do not put large, unoptimized photos in `public/` without a specific reason.
- SVG logos may live in `src/assets/branding/` unless they must be public or served unchanged.
- Use descriptive lowercase filenames with hyphens, such as `charity-hero.jpg` or `wichita-downtown.jpg`.
- Do not create vague asset folders such as `images2`, `new-images`, or `final-images`.
