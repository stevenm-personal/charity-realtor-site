# Kansas Dusk experimental brand system

`BRAND.md` is the authoritative visual, editorial, and brand reference for Charity Menefee Real Estate. Kansas Dusk is the current experimental visual direction on this branch. Future design and copy work must follow it unless the user explicitly approves a change.

## Brand idea

Kansas Dusk keeps the personal hospitality and grounded Kansas character of Prairie Warmth, then adds the richer contrast of late-evening prairie light. The site should feel warm, sophisticated, welcoming, local, and slightly dramatic without leaning on western styling, rustic farmhouse cues, or regional clichés.

Charity Menefee remains the primary brand. The experience should feel personal rather than corporate, patient rather than urgent, and polished without becoming luxurious, pretentious, overly feminine, or reminiscent of a technology company.

## Personality and communication

- Warm, welcoming, and easy-going.
- Patient, helpful, and low-pressure.
- Local and familiar without becoming folksy or overly casual.
- Personal and human, with Charity at the center of the relationship.
- Visually impressive, but calm and grounded after moments of interaction.
- Clear and useful rather than sales-heavy.

Avoid sterile futuristic language, artificial exclusivity, aggressive conversion copy, exaggerated claims, and generic corporate phrasing.

## Editorial voice and point of view

This is Charity Menefee's personal Realtor brand website. Copy should sound as though visitors are hearing from Charity directly when the subject is her experience, approach, services, opinions, or assistance.

- Prefer first-person singular (`I`, `me`, and `my`) for Charity's own role and perspective. Avoid third-person phrases such as "Charity can help" and generic corporate `we` language.
- Do not make the site sound as though a brokerage or corporate organization is describing Charity as one of its agents.
- Do not force first person into every page or paragraph. Choose the point of view that best serves the content.
- Avoid corporate `we` or `our` unless the copy genuinely refers to Charity together with her brokerage or team. Ordinary personal use is appropriate only when the shared subject is clear, such as Charity speaking about her family; never use it as an unnamed corporate narrator.
- Prioritize usefulness first and conversion second. Do not insert a Realtor sales pitch into every informational section.
- Keep the tone warm, local, conversational, grounded, patient, and low-pressure. Avoid generic marketing language and artificial urgency.
- Use natural contractions in visible site copy whenever they sound conversational and appropriate. Avoid unnecessarily formal constructions such as `do not`, `I will`, and `you are` when `don't`, `I'll`, and `you're` would sound more natural. Do not force contractions where they would be awkward, emphatic, legal, or otherwise inappropriate.

Use these page-specific conventions:

- **Homepage:** Speak primarily to the visitor using `you`, with selective first-person language when describing Charity's role or approach.
- **About:** Use first person so the page feels as though Charity is naturally telling her own story.
- **Buying, Selling, and Land & Acreage:** Lead with useful information addressed to the visitor. Use first person when Charity's involvement or approach is relevant.
- **Community pages:** Keep the main body informational and editorial. Describe verified details about the community, properties, geography, amenities, and access directly and neutrally; do not repeatedly sell Charity's services. One restrained first-person invitation near the end is appropriate.
- **Blog:** Informational articles may use a neutral editorial voice. Personal observations or firsthand experience may naturally use first person.
- **Contact:** A conversational first-person voice is appropriate.
- **Legal and disclosure content:** Use the appropriate neutral or formal voice.

All copy must continue to follow Fair Housing requirements. Do not introduce demographic assumptions, steering language, protected-class references, or proxies for protected classes.

## Visual principles

- Prefer parchment, warm cream, and soft ivory backgrounds over stark white.
- Prefer deep espresso and warm charcoal over pure black.
- Use sunset copper as a focused accent for emphasis, links, and active states rather than flooding the site with orange.
- Use prairie olive selectively as an earthy primary and supporting color.
- Balance muted clay, warm earth, prairie grass, and evening-neutral tones so they support the existing photography rather than tinting or competing with it.
- Balance traditional warmth with contemporary composition and interaction.
- Use generous breathing room, readable content widths, and soft visual layering.
- Avoid generic luxury-real-estate aesthetics, excessive glass effects, and tech-product dashboard styling.
- Avoid western, cowboy, farmhouse, wheat, sunflower, barn, and other rustic shorthand.
- Keep the overall experience light and welcoming; Kansas Dusk is not a dark-mode theme.

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

| Role | Token | Kansas Dusk value |
| --- | --- | --- |
| Prairie parchment background | `--color-background` | `#F2E7D8` |
| Evening ivory surface | `--color-surface` | `#FBF5EB` |
| Dusk espresso text and dark sections | `--color-text` | `#30241F` |
| Prairie olive primary/support | `--color-primary` | `#68705A` |
| Sunset copper accent on light surfaces | `--color-accent` | `#984A36` |
| Copper glow accent on dark surfaces | `--color-accent-on-dark` | `#FFF0E7` |
| Weathered taupe secondary neutral | `--color-secondary` | `#B08F78` |
| Warm sand borders and subtle fills | `--color-border` | `#D8C2AD` |
| Soft evening ivory text | `--color-soft-white` | `#FFF9F2` |
| Olive mist supporting surface | `--color-sage-soft` | `#DDE0D2` |
| Clay wash supporting surface | `--color-accent-soft` | `#ECD3C7` |

The Kansas Dusk palette is an experiment and is intentionally easy to revise or compare with Prairie Warmth. It should not be treated as permanently locked. Revise semantic token values centrally when the visual direction evolves; do not scatter replacement colors through components.

## Typography

Kansas Dusk retains the original Prairie Warmth typography treatment from the main branch:

- Display text uses Georgia with Times New Roman as its fallback.
- Body copy, navigation, labels, and controls use Inter with the original system UI fallback stack.

The exact main-branch stacks are defined through `--font-display` and `--font-body` in `src/styles/tokens.css`. Do not hard-code substitute font stacks in individual components. This preserves Prairie Warmth's friendly, soft, readable, and slightly characterful typography while Kansas Dusk supplies the experimental color treatment.

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
