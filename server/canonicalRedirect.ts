const PRODUCTION_ORIGIN = "https://downsizebaltimore.com";
const PUBLIC_HOST = /^(?:www\.)?downsizebaltimore\.com(?::(?:80|443))?$/i;

type CanonicalRedirectInput = {
  method: string;
  host: string | undefined;
  protocol: string;
  originalUrl: string;
  canonicalPath: string | null;
  siteOrigin: string;
  enabled: boolean;
};

function isPrivatePath(pathname: string) {
  return /^\/(?:api|publisher|media\/insights)(?:\/|$)/i.test(
    pathname.replace(/\/{2,}/g, "/"),
  );
}

/** Only callers that have resolved a real route may supply canonicalPath. */
export function canonicalRedirect(input: CanonicalRedirectInput): string | null {
  if (input.method !== "GET" && input.method !== "HEAD") return null;

  const canonicalPath = input.canonicalPath;
  // These are application route paths, not arbitrary user-supplied URL targets.
  if (
    !canonicalPath ||
    !/^\/[a-z0-9._/-]*$/i.test(canonicalPath) ||
    canonicalPath.includes("//") ||
    /(?:^|\/)\.{1,2}(?:\/|$)/.test(canonicalPath)
  ) return null;

  const queryIndex = input.originalUrl.indexOf("?");
  const pathname = queryIndex < 0
    ? input.originalUrl
    : input.originalUrl.slice(0, queryIndex);
  const query = queryIndex < 0 ? "" : input.originalUrl.slice(queryIndex);
  const privatePath = isPrivatePath(pathname) || isPrivatePath(canonicalPath);

  // Never use Host or any forwarded-host header as a redirect destination.
  // The explicit allowlist also leaves local and hosting-preview requests alone.
  const normalizeOrigin = input.enabled &&
    input.siteOrigin === PRODUCTION_ORIGIN &&
    Boolean(input.host && PUBLIC_HOST.test(input.host)) &&
    (input.protocol === "http" || input.protocol === "https") &&
    !privatePath;
  const originChanged = normalizeOrigin && (
    input.protocol !== "https" || input.host?.toLowerCase() !== "downsizebaltimore.com"
  );
  const pathChanged = canonicalPath !== pathname;
  if (!originChanged && !pathChanged) return null;

  // Preserve existing same-origin publisher alias handling without redirecting
  // API requests or private image previews, which may depend on host-only cookies.
  if (privatePath && canonicalPath !== "/publisher") return null;

  const destination = new URL(PRODUCTION_ORIGIN);
  destination.pathname = canonicalPath;
  destination.search = query;
  return originChanged
    ? destination.href
    : `${destination.pathname}${destination.search}`;
}
