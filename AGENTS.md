# Project rules for Codex

## Brand authority

- Read and follow `BRAND.md` before making visual, interaction, typography, color, photography, or brand decisions.
- Treat `BRAND.md` as the authoritative design reference unless the user explicitly approves a change.
- Use semantic variables from `src/styles/tokens.css` instead of hard-coding repeated visual values in components.
- Update shared design decisions centrally in `src/styles/tokens.css` when appropriate, without over-engineering the token system.

## Architecture

- Keep this site on Astro with static output.
- Do not add React, Tailwind, a CMS, a database, or Cloudflare runtime code.
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
- Store Charity headshots, brokerage and Realtor logos, and team or brand graphics in `src/assets/branding/`.
- Store homepage hero and homepage-specific photography in `src/assets/homepage/`.
- Store location photography in `src/assets/locations/<city>/`, using the matching city folder.
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
