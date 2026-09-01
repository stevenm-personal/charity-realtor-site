// Shared generator for the eight community social-share cards
// (public/images/static/social/<slug>-social-share.jpg).
//
// Usage:
//   node scripts/generate-social-cards.mjs <slug>   regenerate one card
//   node scripts/generate-social-cards.mjs all       regenerate all eight
//
// Does NOT touch the default card (public/images/static/charity-menefee-social-share.jpg)
// or any blog social image - those are unrelated, hand-built assets.

import sharp from 'sharp';
import { statSync } from 'node:fs';

export const COMMUNITY_CARD_BRANDING = {
  charityMenefeeSize: 22,
  realtorSize: 18,
  registeredMarkSize: 14,
  registeredMarkDy: -3,
  brooktownSize: 16, // kept for reference; see brandingSvg for actual usage
};

export const communities = [
  { slug: 'wichita', name: 'Wichita, Kansas', src: 'src/assets/communities/wichita/wichita-keeper-of-the-plains-kansastourism-NoC.jpg', crop: { left: 0, top: 40, width: 3200, height: 1680 } },
  { slug: 'valley-center', name: 'Valley Center, Kansas', src: 'src/assets/communities/valley-center/valley-center-water-tower-self-owned.jpg', crop: { left: 0, top: 150, width: 2528, height: 1327 } },
  { slug: 'andover', name: 'Andover, Kansas', src: 'src/assets/communities/andover/city-of-andover-heritage-park-plaza-statue.jpg', crop: { left: 0, top: 150, width: 2600, height: 1365 } },
  { slug: 'derby', name: 'Derby, Kansas', src: 'src/assets/communities/derby/rock-river-rapids-aerial-rock-river-rapids.jpg', crop: { left: 0, top: 350, width: 3200, height: 1680 } },
  { slug: 'goddard', name: 'Goddard, Kansas', src: 'src/assets/communities/goddard/goddard-fall-festival-movie-in-the-park-city-of-goddard.jpg', crop: { left: 0, top: 40, width: 2200, height: 1155 } },
  { slug: 'maize', name: 'Maize, Kansas', src: 'src/assets/communities/maize/maize-water-tower-better-self-owned.jpg', crop: { left: 0, top: 90, width: 1537, height: 807 } },
  { slug: 'newton', name: 'Newton, Kansas', src: 'src/assets/communities/newton/newton-amtrak-self-taken.jpg', crop: { left: 0, top: 90, width: 2528, height: 1327 } },
  { slug: 'park-city', name: 'Park City, Kansas', src: 'src/assets/communities/park-city/park-city-gilleys-self-owned.jpg', crop: { left: 0, top: 140, width: 2528, height: 1327 } },
];

// Measures the actual rendered ink-width of a text run at a given size/weight,
// by rasterizing it in isolation and finding the rightmost lit pixel. Used so the
// "Charity Menefee," -> "REALTOR" gap is calculated from real glyph metrics
// rather than guessed - a trailing space at a tspan boundary gets silently
// trimmed by the SVG renderer, so we can't just rely on a literal " " there.
async function measureWidth(text, fontSize, { fontFamily = 'Georgia, serif', fontWeight = 700 } = {}) {
  const svg = Buffer.from(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='200'><rect width='1600' height='200' fill='#000'/><text x='0' y='150' font-family='${fontFamily}' font-size='${fontSize}' font-weight='${fontWeight}' fill='#fff'>${text}</text></svg>`
  );
  const { data, info } = await sharp(svg).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let maxX = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C] > 40 && x > maxX) maxX = x;
    }
  }
  return maxX;
}

// One real space character's rendered width at 22px Georgia bold, measured
// in isolation (same technique as above) - used as the "normal word-space" gap.
const NORMAL_SPACE_WIDTH_AT_22PX = 5;

async function brandingSvg(communityName) {
  const { charityMenefeeSize, realtorSize, registeredMarkSize, registeredMarkDy } = COMMUNITY_CARD_BRANDING;
  const leftMargin = 64;
  const nameWidth = await measureWidth('Charity Menefee,', charityMenefeeSize);
  const gap = Math.round(NORMAL_SPACE_WIDTH_AT_22PX * (charityMenefeeSize / 22));
  const realtorX = leftMargin + nameWidth + gap;

  return `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
    <defs>
      <linearGradient id='scrim' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stop-color='#30241F' stop-opacity='0'/>
        <stop offset='100%' stop-color='#30241F' stop-opacity='0.82'/>
      </linearGradient>
    </defs>
    <rect x='0' y='340' width='1200' height='290' fill='url(#scrim)'/>
    <text x='${leftMargin}' y='520' font-family='Georgia, serif' font-size='48' font-weight='700' fill='#FFF9F2'>${communityName}</text>
    <text x='${leftMargin}' y='555' font-family='Georgia, serif' font-size='${charityMenefeeSize}' font-weight='700' fill='#FFF9F2'>Charity Menefee,</text>
    <text x='${realtorX}' y='555' font-family='Georgia, serif' font-weight='700' fill='#FFF9F2'><tspan font-size='${realtorSize}'>REALTOR<tspan font-size='${registeredMarkSize}' dy='${registeredMarkDy}'>&#174;</tspan></tspan></text>
    <text x='${leftMargin}' y='580' font-family='Inter, Arial, sans-serif' font-size='16' font-weight='700' fill='#FFF9F2'>Bricktown ICT Realty</text>
    <text x='${leftMargin}' y='602' font-family='Inter, Arial, sans-serif' font-size='13' font-weight='700' fill='#FFF9F2'>charitymenefee.com</text>
  </svg>`;
}

export async function generateCard(community) {
  const out = `public/images/static/social/${community.slug}-social-share.jpg`;
  const svg = Buffer.from(await brandingSvg(community.name));
  const photo = await sharp(community.src, { failOn: 'none' })
    .rotate()
    .extract(community.crop)
    .resize({ width: 1200, height: 630 })
    .toBuffer();
  const info = await sharp(photo)
    .composite([{ input: svg, left: 0, top: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .withMetadata()
    .toFile(out);
  console.log(community.slug.padEnd(14), `${info.width}x${info.height}`, `${(statSync(out).size / 1024).toFixed(0)}KB`);
  return out;
}

const arg = process.argv[2];
if (arg) {
  const targets = arg === 'all' ? communities : communities.filter((c) => c.slug === arg);
  if (targets.length === 0) {
    console.error(`Unknown community slug: ${arg}`);
    process.exit(1);
  }
  for (const c of targets) await generateCard(c);
}
