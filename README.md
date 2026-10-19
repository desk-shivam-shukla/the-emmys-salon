# The Emmys Salon

Bilingual (JA/EN) static marketing site for **Emmy's Salon** — single-page landing with menu and reservation routes. Built with [Astro](https://astro.build), Tailwind CSS, Lenis, and GSAP.

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (paths use the GitHub Pages `base` by default: `/the-emmys-salon/`).

Optional local overrides — copy [`.env.example`](.env.example) to `.env`.

## Build

```bash
npm run build
npm run preview
```

## Deploy — GitHub Pages

1. Push to `main`.
2. **Settings → Pages → Build and deployment → GitHub Actions**.
3. Set repository **Variables** (optional overrides):
   - `PUBLIC_SITE_URL` — e.g. `https://<user>.github.io`
   - `PUBLIC_BASE_PATH` — e.g. `/the-emmys-salon/` (use `/` for a user/org root site)
   - `PUBLIC_SALON_PHONE`, `PUBLIC_HOTPEPPER_URL`, `PUBLIC_GOOGLE_FORM_URL`, `PUBLIC_GOOGLE_MAPS_EMBED_URL`

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Live URL (project site): `https://<user>.github.io/the-emmys-salon/ja/`

## Content

| Path | Purpose |
| ---- | ------- |
| `src/data/salon.json` | Hours, address, contact, schedule rules, booking URLs |
| `src/data/availability.json` | Weekly slot status overrides (○ / △ / ×) |
| `src/data/menu.json` | Menu and prices |
| `src/data/stylist.json` | Solo stylist profile |
| `src/data/gallery.json` | Gallery items |
| `src/content/news/` | News posts (per locale) |
| `src/i18n/ui.*.json` | UI strings |

Replace placeholder images under `public/images/`.

## Reservation schedule

The reserve page shows a 1-hour weekly grid. Symbols: **○** open, **△** busy, **×** full, **—** closed or outside hours. National holidays are shaded; salon closed days (see `schedule` in `salon.json`) show muted columns.

Update [`src/data/availability.json`](src/data/availability.json) with keys like `"2026-10-20T10:00": "busy"`. Allowed values: `open`, `busy`, `full`. Omitted in-hours slots default to **○**.

Set `googleFormUrl` in `salon.json` or `PUBLIC_GOOGLE_FORM_URL` for the reservation form button. Tapping an open slot scrolls to online booking and opens the form URL (optional `entry.date` / `entry.time` query params — replace with your form’s prefill IDs if needed).

## Adding a backend later

- Form fields match `BookingRequest` in [`src/schemas/salon.ts`](src/schemas/salon.ts).
- Point the reserve form to a `POST` API on another host; GitHub Pages stays static.
- Schemas and JSON shapes are CMS-ready (headless CMS or Astro SSR adapter on a different deploy target).
