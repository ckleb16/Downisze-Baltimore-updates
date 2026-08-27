import compression from "compression";
import express, { type Request } from "express";
import { readFile } from "fs/promises";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  NOT_FOUND_METADATA,
  SITE_ROUTES,
  canonicalizeRecognizedPath,
  findSiteRoute,
} from "../client/src/lib/siteRoutes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_SITE_URL = "https://downsizebaltimore.com";
const SOCIAL_IMAGE_PATH = "/downsize-baltimore-social-share.jpg";
const SOCIAL_IMAGE_ALT =
  "Downsize Baltimore — clear housing guidance from Mary Lynch";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function configuredSiteOrigin() {
  const url = new URL(process.env.SITE_URL || DEFAULT_SITE_URL);
  return url.origin;
}

function requestOrigin(req: Request) {
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || req.protocol || "https";
  const host = req.get("host");
  if (!host || !/^[a-z0-9.:[\]-]+$/i.test(host)) return configuredSiteOrigin();
  return `${protocol}://${host}`;
}

function isIndexableRequest(req: Request) {
  const explicit = process.env.SITE_INDEXABLE?.trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  if (process.env.NODE_ENV !== "production") return false;

  try {
    return new URL(requestOrigin(req)).host === new URL(configuredSiteOrigin()).host;
  } catch {
    return false;
  }
}

function metadataMarkup(req: Request, routePath: string | null) {
  const route = routePath ? findSiteRoute(routePath) : undefined;
  const metadata = route ?? NOT_FOUND_METADATA;
  const indexable = Boolean(route) && isIndexableRequest(req);
  const origin = indexable ? configuredSiteOrigin() : requestOrigin(req);
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

function renderDocument(template: string, req: Request, routePath: string | null) {
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
      /<!--__ROUTE_META_START__-->[\s\S]*?<!--__ROUTE_META_END__-->/,
      metadataMarkup(req, route?.path ?? null),
    );
}

function isFingerprintAsset(filePath: string) {
  const normalized = filePath.replaceAll("\\", "/");
  return (
    /\/assets\/[^/]+-[a-z0-9_-]{8,}\.[^/]+$/i.test(normalized) ||
    /[_.-][a-f0-9]{8,}(?:-[a-z0-9_-]+)?\.[^/]+$/i.test(normalized)
  );
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(compression());

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");
  const indexTemplate = await readFile(path.join(staticPath, "index.html"), "utf8");

  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const queryIndex = req.originalUrl.indexOf("?");
    const query = queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : "";

    if (req.path.toLowerCase() === "/index.html") {
      return res.redirect(308, `/${query}`);
    }

    const canonical = canonicalizeRecognizedPath(req.path);
    if (canonical && canonical !== req.path) {
      return res.redirect(308, `${canonical}${query}`);
    }

    next();
  });

  app.get("/robots.txt", (req, res) => {
    res.set("Cache-Control", "public, max-age=3600");
    res.type("text/plain");
    if (!isIndexableRequest(req)) {
      return res.send("User-agent: *\nDisallow: /\n");
    }

    return res.send(
      `User-agent: *\nAllow: /\nSitemap: ${configuredSiteOrigin()}/sitemap.xml\n`,
    );
  });

  app.get("/sitemap.xml", (_req, res) => {
    res.set("Cache-Control", "public, max-age=3600");
    res.type("application/xml");
    const origin = configuredSiteOrigin();
    const urls = SITE_ROUTES.map(
      (route) =>
        `  <url><loc>${escapeHtml(new URL(route.path, `${origin}/`).href)}</loc></url>`,
    ).join("\n");
    return res.send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
  });

  app.use(
    express.static(staticPath, {
      index: false,
      setHeaders(res, filePath) {
        if (path.basename(filePath).toLowerCase() === "index.html") {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
        } else if (isFingerprintAsset(filePath)) {
          res.setHeader(
            "Cache-Control",
            "public, max-age=31536000, immutable",
          );
        } else {
          res.setHeader("Cache-Control", "public, max-age=86400");
        }
      },
    }),
  );

  app.get("*", (req, res) => {
    const route = findSiteRoute(req.path);
    res.set("Cache-Control", "no-cache, must-revalidate");
    if (!route) res.status(404);
    res.type("html").send(renderDocument(indexTemplate, req, route?.path ?? null));
  });

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
