/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BASE_PATH?: string;
  readonly PUBLIC_SALON_PHONE?: string;
  readonly PUBLIC_HOTPEPPER_URL?: string;
  readonly PUBLIC_GOOGLE_FORM_URL?: string;
  readonly PUBLIC_GOOGLE_MAPS_EMBED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
