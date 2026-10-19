import salonJson from '../data/salon.json';
import menuJson from '../data/menu.json';
import stylistJson from '../data/stylist.json';
import galleryJson from '../data/gallery.json';
import testimonialsJson from '../data/testimonials.json';
import availabilityJson from '../data/availability.json';
import {
  salonSchema,
  menuSchema,
  stylistSchema,
  galleryItemSchema,
  testimonialSchema,
  availabilitySchema,
} from '../schemas/salon';

/** GitHub Actions vars are often set but empty; treat those like unset. */
function envOr<T extends string | undefined>(
  value: string | undefined,
  fallback: T,
): T {
  const trimmed = value?.trim();
  return (trimmed ? trimmed : fallback) as T;
}

export const salon = salonSchema.parse({
  ...salonJson,
  phone: envOr(import.meta.env.PUBLIC_SALON_PHONE, salonJson.phone),
  hotpepperUrl: envOr(
    import.meta.env.PUBLIC_HOTPEPPER_URL,
    salonJson.hotpepperUrl,
  ),
  googleFormUrl: envOr(
    import.meta.env.PUBLIC_GOOGLE_FORM_URL,
    salonJson.googleFormUrl,
  ),
  mapsEmbedUrl: envOr(
    import.meta.env.PUBLIC_GOOGLE_MAPS_EMBED_URL,
    salonJson.mapsEmbedUrl,
  ),
});

export const availability = availabilitySchema.parse(availabilityJson);
export const menu = menuSchema.parse(menuJson);
export const stylist = stylistSchema.parse(stylistJson);
export const gallery = galleryJson.map((item) => galleryItemSchema.parse(item));
export const testimonials = testimonialsJson.map((item) =>
  testimonialSchema.parse(item),
);
