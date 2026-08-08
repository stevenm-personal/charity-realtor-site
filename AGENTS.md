# Project rules for Codex

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
