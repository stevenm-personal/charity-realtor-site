# Prairie Warmth brand system

`BRAND.md` is the authoritative visual and brand reference for Charity Menefee Real Estate. Future design work must follow this direction unless the user explicitly approves a change.

## Brand idea

Prairie Warmth combines traditional hospitality with contemporary web craft. The site should feel warm, welcoming, local, approachable, and distinctly Kansas without leaning on rustic styling, country themes, or regional clichés.

Charity Menefee is the primary brand. The experience should feel personal rather than corporate, patient rather than urgent, and polished without resembling a Silicon Valley product site or generic luxury-real-estate template.

## Personality and communication

- Warm, welcoming, and easy-going.
- Patient, helpful, and low-pressure.
- Local and familiar without becoming folksy or overly casual.
- Personal and human, with Charity at the center of the relationship.
- Visually impressive, but calm and grounded after moments of interaction.
- Clear and useful rather than sales-heavy.

Avoid sterile futuristic language, artificial exclusivity, aggressive conversion copy, exaggerated claims, and generic corporate phrasing.

## Visual principles

- Prefer warm cream and off-white backgrounds over stark white.
- Prefer warm charcoal over pure black.
- Use prairie gold as an accent, not as a dominant yellow field.
- Use muted sage selectively as an earthy primary or supporting color.
- Balance traditional warmth with contemporary composition and interaction.
- Use generous breathing room, readable content widths, and soft visual layering.
- Avoid generic luxury-real-estate aesthetics, excessive glass effects, and tech-product dashboard styling.
- Avoid farmhouse shorthand and repeated wheat, sunflower, barn, or rustic motifs.

## Responsive and mobile-first design

Responsive design is a first-class brand requirement, not a finishing pass.

- Design layouts mobile-first, then progressively enhance them for tablet, laptop, and desktop widths.
- Do not build a desktop layout first and treat mobile behavior as cleanup work.
- Define responsive behavior as each component is built rather than deferring it until the end of a page build.
- Give navigation a clear, accessible mobile pattern with understandable controls, keyboard support, and appropriate state communication.
- Scale typography, spacing, buttons, cards, images, forms, and content density appropriately across viewport sizes.
- Avoid horizontal scrolling at normal viewport widths. Decorative motion and layered layouts must remain contained within the viewport.
- Make touch targets comfortably sized and spaced for mobile users; aim for at least `44px` by `44px` where practical.
- Keep hero sections readable, balanced, and visually strong on small screens. Headlines, supporting copy, actions, and imagery must retain a clear hierarchy without crowding.
- Use responsive image sizing and Astro's image optimization pipeline for large photographic assets where appropriate.
- Ensure scroll animation and interactive effects do not interfere with reading, navigation, input, scrolling, or mobile performance.
- Continue respecting `prefers-reduced-motion` across all motion and interaction work.
- Before considering a substantial page or component complete, verify it at representative phone, tablet, laptop, and desktop widths.
- Treat responsive verification as part of implementation, not as a separate final polish phase.

## Color palette

The palette lives in `src/styles/tokens.css`. Components must use semantic variables rather than copying hex values or naming variables after literal colors.

| Role | Token | Initial value |
| --- | --- | --- |
| Page background | `--color-background` | `#F6F0E6` |
| Elevated surface | `--color-surface` | `#FCFAF6` |
| Main text and dark sections | `--color-text` | `#292825` |
| Earthy primary/support | `--color-primary` | `#6F7D65` |
| Highlight and focus accent | `--color-accent` | `#C69A45` |
| Secondary neutral | `--color-secondary` | `#B69B7D` |
| Borders and subtle fills | `--color-border` | `#DDD0BF` |
| Soft text on dark surfaces | `--color-soft-white` | `#FFFDFC` |

The palette is an initial direction and is intentionally easy to revise. It should not be treated as permanently locked. Revise the semantic token values centrally when the visual direction evolves; do not scatter replacement colors through components.

## Typography

Typography is not finalized. The desired personality is friendly, soft, highly readable, and slightly characterful. Avoid futuristic, highly geometric, clinical, or overly formal type choices.

The current project uses system sans-serif text with Georgia for display headings. Treat that as a practical interim choice, not a permanent brand decision. Do not add fonts until typography is reviewed intentionally.

## Photography and imagery

Photography should ultimately emphasize:

- Kansas landscapes and warm evening light.
- Wichita-area communities and recognizable local context.
- Welcoming, normal homes rather than aspirational mansions by default.
- Authentic moments, natural expressions, and an approachable sense of place.
- Charity as a trusted human presence without making her portrait dominate the hero.

Avoid luxury imagery unless the page context specifically calls for it. Avoid over-staged stock photography and visual clichés. Preserve the asset organization documented in `AGENTS.md`, and review existing assets intentionally before incorporating them into pages.

## Motion and interaction

Motion should combine contemporary polish with a calm resting state:

- Reveals may be noticeable and visually impressive, but should settle completely.
- Favor opacity and transform animation over layout-heavy effects.
- Use directional variety and stagger only where it supports hierarchy.
- Keep continuous motion limited and purposeful.
- Always respect `prefers-reduced-motion`.
- Keep mobile performance and input responsiveness in mind.

## Shape, spacing, and surfaces

- Favor soft, restrained radii over excessively rounded cards.
- Use pill shapes selectively for compact actions, not as a universal motif.
- Prefer subtle borders and warm shadows over cold gray dividers.
- Keep text columns comfortably readable and page sections spacious.
- Use layering to create depth without making the interface feel glossy or futuristic.

Reusable spacing, radius, width, shadow, and motion values are defined in `src/styles/tokens.css`. Extend that file only when a value is genuinely reusable; avoid turning the token system into an exhaustive framework.

## Implementation rules

- Read this file before making visual or brand decisions.
- Use semantic variables from `src/styles/tokens.css` for visual components.
- Change shared visual decisions at the token level when possible.
- Do not add a styling framework or animation library without a compelling, approved reason.
- Do not redesign an existing page merely to introduce or adjust tokens.
- Maintain accessibility, responsive behavior, and reduced-motion support.
- Do not consider substantial page or component work complete until its representative phone, tablet, laptop, and desktop behavior has been verified.
