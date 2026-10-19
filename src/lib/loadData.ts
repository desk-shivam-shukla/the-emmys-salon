import salonJson from '../data/salon.json';
import menuJson from '../data/menu.json';
import stylistJson from '../data/stylist.json';
import galleryJson from '../data/gallery.json';
import testimonialsJson from '../data/testimonials.json';
import {
  salonSchema,
  menuSchema,
  stylistSchema,
  galleryItemSchema,
  testimonialSchema,
} from '../schemas/salon';

export const salon = salonSchema.parse({
  ...salonJson,
  phone: import.meta.env.PUBLIC_SALON_PHONE ?? salonJson.phone,
  hotpepperUrl:
    import.meta.env.PUBLIC_HOTPEPPER_URL ?? salonJson.hotpepperUrl,
  mapsEmbedUrl:
    import.meta.env.PUBLIC_GOOGLE_MAPS_EMBED_URL ?? salonJson.mapsEmbedUrl,
});

export const menu = menuSchema.parse(menuJson);
export const stylist = stylistSchema.parse(stylistJson);
export const gallery = galleryJson.map((item) => galleryItemSchema.parse(item));
export const testimonials = testimonialsJson.map((item) =>
  testimonialSchema.parse(item),
);
