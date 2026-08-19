// Resolve a same-origin path to an absolute URL using Astro's configured
// `site`. Falls back to the raw path if `site` isn't set (e.g. local dev
// without the config value), matching the previous inline behavior.
export function resolveAbsoluteURL(site: URL | undefined, path: string): string {
  return site ? new URL(path, site).href : path;
}
