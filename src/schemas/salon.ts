import { z } from 'zod';

export const localizedStringSchema = z.object({
  ja: z.string(),
  en: z.string(),
});

export const salonSchema = z.object({
  name: localizedStringSchema,
  tagline: localizedStringSchema,
  phone: z.string(),
  address: localizedStringSchema,
  stations: localizedStringSchema,
  hours: localizedStringSchema,
  holidays: localizedStringSchema,
  receptionNotes: localizedStringSchema,
  hotpepperUrl: z.string().url().optional(),
  mapsEmbedUrl: z.string().url().optional(),
  social: z
    .object({
      instagram: z.string().url().optional(),
    })
    .optional(),
});

export const menuItemSchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  description: localizedStringSchema.optional(),
  priceYen: z.number().optional(),
  priceLabel: localizedStringSchema.optional(),
  featured: z.boolean().optional(),
});

export const menuCategorySchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  items: z.array(menuItemSchema),
});

export const menuSchema = z.object({
  tiers: z.array(
    z.object({
      id: z.string(),
      name: localizedStringSchema,
      note: localizedStringSchema.optional(),
    }),
  ),
  categories: z.array(menuCategorySchema),
});

export const stylistSchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  nameReading: z.string().optional(),
  role: localizedStringSchema,
  bio: localizedStringSchema,
  quote: localizedStringSchema.optional(),
  specialties: z.array(localizedStringSchema),
  photos: z.object({
    primary: z.string(),
    secondary: z.string().optional(),
  }),
});

export const galleryItemSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: localizedStringSchema,
  tags: z.array(z.string()),
});

export const testimonialSchema = z.object({
  id: z.string(),
  quote: localizedStringSchema,
  author: z.string(),
  menuHint: localizedStringSchema.optional(),
});

export const bookingRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  menuId: z.string().optional(),
  stylistId: z.string().min(1),
  notes: z.string().optional(),
  locale: z.enum(['ja', 'en']),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;
export type Salon = z.infer<typeof salonSchema>;
export type Menu = z.infer<typeof menuSchema>;
export type Stylist = z.infer<typeof stylistSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
