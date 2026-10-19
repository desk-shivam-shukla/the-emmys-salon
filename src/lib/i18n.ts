import uiJa from '../i18n/ui.ja.json';
import uiEn from '../i18n/ui.en.json';

export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const uiMap = { ja: uiJa, en: uiEn } as const;

export function t(locale: Locale, key: string): string {
  const parts = key.split('.');
  let node: unknown = uiMap[locale];
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof node === 'string' ? node : key;
}

export function localized<T extends { ja: string; en: string }>(
  locale: Locale,
  value: T,
): string {
  return value[locale];
}

export function localePath(locale: Locale, path: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  if (!normalized) return `${base}${locale}/`;
  return `${base}${locale}/${normalized}`;
}

export function switchLocalePath(currentLocale: Locale, targetLocale: Locale, pathSuffix = ''): string {
  return localePath(targetLocale, pathSuffix);
}
