import { ROUTE_HERO_MEDIA } from "../client/src/lib/routeMedia";
import { responsiveImageAttributes } from "../client/src/lib/responsiveMedia";

function escapeAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#39;");
}

export function renderRouteHeroPreload(routePath: string | null | undefined) {
  if (!routePath || !Object.hasOwn(ROUTE_HERO_MEDIA, routePath)) return "";
  const hero = ROUTE_HERO_MEDIA[routePath as keyof typeof ROUTE_HERO_MEDIA];
  const image = responsiveImageAttributes(hero.src, hero.sizes);
  // Split portraits stack below the copy on small screens; don't compete with
  // opening text/fonts there. These are the existing layout breakpoints.
  const media = routePath === "/" || routePath === "/downsizing-services"
    ? "" : routePath === "/aging-in-place" ? "(min-width: 901px)" : "(min-width: 1181px)";
  // No href: browsers without responsive preload support skip this hint instead
  // of downloading a large fallback followed by the mobile img candidate.
  return `<link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="${escapeAttribute(image.srcSet)}" imagesizes="${escapeAttribute(image.sizes)}"${media ? ` media="${media}"` : ""} />`;
}
