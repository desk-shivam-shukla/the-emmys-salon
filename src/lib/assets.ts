/** Prefix public asset paths with Astro base URL (GitHub Pages project site). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${clean}`.replace(/([^:]\/)\/+/g, '$1');
}
