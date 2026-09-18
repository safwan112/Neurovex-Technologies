import { getRelativeLocaleUrl } from "astro:i18n";
import { defaultLocale, ui, type Locale } from "./ui";

export function useTranslations(locale: string | undefined) {
  const lang: Locale = locale === "en" ? "en" : defaultLocale;
  return function t<K extends keyof typeof ui.fr>(key: K): (typeof ui)[Locale][K] {
    return ui[lang][key];
  };
}

export function getOtherLocale(locale: string | undefined): Locale {
  return locale === "en" ? "fr" : "en";
}

// Static routes that exist in both locales, used by the language switch
// button to know it's safe to link directly instead of falling back home.
const translatableBasePaths = ["/", "/services", "/contact", "/about", "/blog"];

// Slugs of the blog articles that have an English translation.
export const translatedBlogSlugs = [
  "transformation-numerique-pme-marrakech",
  "choisir-solution-telephonie-ip-entreprise",
  "maintenance-informatique-preventive",
];

export function getAlternateLocaleHref(
  pathname: string,
  targetLocale: Locale
): string {
  // Astro's `build.format: "file"` makes `Astro.url.pathname` include a
  // trailing `.html` (e.g. "/services.html") instead of the clean route.
  const withoutHtml = pathname.replace(/(?:\/index)?\.html$/, "") || "/";
  const unprefixed = withoutHtml.replace(/^\/en(\/|$)/, "/");
  const normalized =
    unprefixed !== "/" && unprefixed.endsWith("/")
      ? unprefixed.slice(0, -1)
      : unprefixed;

  const isTranslatable =
    translatableBasePaths.includes(normalized) ||
    translatedBlogSlugs.some(slug => normalized === `/blog/${slug}`);

  const target = isTranslatable ? normalized : "/";
  return getRelativeLocaleUrl(targetLocale, target);
}
