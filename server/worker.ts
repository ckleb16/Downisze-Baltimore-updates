import {
  NOT_FOUND_METADATA,
  SITE_ROUTES,
  canonicalizeRecognizedPath,
  findSiteRoute,
} from "../client/src/lib/siteRoutes";

const DEFAULT_SITE_URL = "https://downsizebaltimore.com";
const SOCIAL_IMAGE_PATH = "/downsize-baltimore-social-share.jpg";
const SOCIAL_IMAGE_ALT =
  "Downsize Baltimore — clear housing guidance from Mary Lynch";

type AssetBinding = {
  fetch(request: Request): Promise<Response>;
};

type WorkerEnv = {
  ASSETS: AssetBinding;
  SITE_INDEXABLE?: string;
  SITE_URL?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function configuredSiteOrigin(env: WorkerEnv) {
  return new URL(env.SITE_URL || DEFAULT_SITE_URL).origin;
}

function isIndexableRequest(request: Request, env: WorkerEnv) {
  const explicit = env.SITE_INDEXABLE?.trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  return new URL(request.url).host === new URL(configuredSiteOrigin(env)).host;
}

function metadataMarkup(
  request: Request,
  env: WorkerEnv,
  routePath: string | null,
) {
  const route = routePath ? findSiteRoute(routePath) : undefined;
  const metadata = route ?? NOT_FOUND_METADATA;
  const indexable = Boolean(route) && isIndexableRequest(request, env);
  const requestOrigin = new URL(request.url).origin;
  const origin = indexable ? configuredSiteOrigin(env) : requestOrigin;
  const canonicalUrl = route ? new URL(route.path, `${origin}/`).href : null;
  const socialImageUrl = new URL(SOCIAL_IMAGE_PATH, `${origin}/`).href;
  const robots = indexable ? "index,follow" : "noindex,nofollow";

  return [
    `<meta name="robots" content="${robots}" />`,
    canonicalUrl
      ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
      : "",
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Downsize Baltimore" />',
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    canonicalUrl
      ? `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
      : "",
    `<meta property="og:image" content="${escapeHtml(socialImageUrl)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escapeHtml(SOCIAL_IMAGE_ALT)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(socialImageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(SOCIAL_IMAGE_ALT)}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

function renderDocument(
  template: string,
  request: Request,
  env: WorkerEnv,
  routePath: string | null,
) {
  const route = routePath ? findSiteRoute(routePath) : undefined;
  const metadata = route ?? NOT_FOUND_METADATA;

  return template
    .replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapeHtml(metadata.title)}</title>`,
    )
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/i,
      `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    )
    .replace(
      "<!--__ROUTE_META__-->",
      metadataMarkup(request, env, route?.path ?? null),
    );
}

function cacheControlFor(pathname: string) {
  if (
    /\/assets\/[^/]+-[a-z0-9_-]{8,}\.[^/]+$/i.test(pathname) ||
    /[_.-][a-f0-9]{8,}(?:-[a-z0-9_-]+)?\.[^/]+$/i.test(pathname)
  ) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=86400";
}

function withCacheControl(response: Response, pathname: string, method: string) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", cacheControlFor(pathname));
  return new Response(method === "HEAD" ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function textResponse(
  body: string,
  contentType: string,
  method: string,
  status = 200,
) {
  return new Response(method === "HEAD" ? null : body, {
    status,
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": contentType,
    },
  });
}

async function renderRoute(
  request: Request,
  env: WorkerEnv,
  routePath: string | null,
) {
  const indexRequest = new Request(new URL("/index.html", request.url), {
    method: "GET",
    headers: request.headers,
  });
  const templateResponse = await env.ASSETS.fetch(indexRequest);
  if (!templateResponse.ok) {
    return new Response("Site shell unavailable", { status: 503 });
  }

  const html = renderDocument(
    await templateResponse.text(),
    request,
    env,
    routePath,
  );
  return new Response(request.method === "HEAD" ? null : html, {
    status: routePath ? 200 : 404,
    headers: {
      "Cache-Control": "no-cache, must-revalidate",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export default {
  async fetch(request: Request, env: WorkerEnv) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    if (pathname.toLowerCase() === "/index.html") {
      return Response.redirect(new URL(`/${search}`, request.url), 308);
    }

    const canonical = canonicalizeRecognizedPath(pathname);
    if (canonical && canonical !== pathname) {
      return Response.redirect(new URL(`${canonical}${search}`, request.url), 308);
    }

    if (pathname === "/robots.txt") {
      const body = isIndexableRequest(request, env)
        ? `User-agent: *\nAllow: /\nSitemap: ${configuredSiteOrigin(env)}/sitemap.xml\n`
        : "User-agent: *\nDisallow: /\n";
      return textResponse(body, "text/plain; charset=utf-8", request.method);
    }

    if (pathname === "/sitemap.xml") {
      const origin = configuredSiteOrigin(env);
      const urls = SITE_ROUTES.map(
        (route) =>
          `  <url><loc>${escapeHtml(new URL(route.path, `${origin}/`).href)}</loc></url>`,
      ).join("\n");
      const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      return textResponse(body, "application/xml; charset=utf-8", request.method);
    }

    const route = findSiteRoute(pathname);
    if (route) return renderRoute(request, env, route.path);

    const looksLikeAsset =
      pathname.startsWith("/assets/") ||
      pathname.startsWith("/manus-storage/") ||
      pathname.startsWith("/captions/") ||
      /\.[a-z0-9]+$/i.test(pathname);

    if (looksLikeAsset) {
      return withCacheControl(
        await env.ASSETS.fetch(request),
        pathname,
        request.method,
      );
    }

    return renderRoute(request, env, null);
  },
};
