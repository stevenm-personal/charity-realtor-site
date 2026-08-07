# Project rules for Codex

## Architecture

- Keep this site on Astro with static output.
- Do not add React, Tailwind, a CMS, a database, or Cloudflare runtime code.
- Prefer Astro components and plain CSS. Add client-side JavaScript only when a feature truly requires it.
- Keep dependencies minimal and explain why any new dependency is needed.

## Development

- Put pages in `src/pages/`, shared layouts in `src/layouts/`, and global styles in `src/styles/`.
- Build responsive, accessible interfaces with semantic HTML and visible keyboard focus states.
- Run `pnpm build` after project changes and fix project-related build errors.
- Do not commit or push unless the user explicitly asks.
