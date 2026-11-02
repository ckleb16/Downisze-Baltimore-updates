import compression from "compression";
import express, { type Request } from "express";
import { readFile } from "fs/promises";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  PAGE_ROUTES,
  articleSlugFromPath,
  canonicalizeRecognizedPath,
  findPageRoute,
} from "../client/src/lib/siteRoutes";
import {
  getPublishedPostBySlug,
  listPublishedPostSlugs,
  type PublicInsightPost,
} from "./posts";
import {
  expressRequestToWebRequest,
  handleGodaddyApi,
  sendWebResponse,
  serveInsightImage,
  type ApiEnvironment,
} from "./godaddyApi";
import {
  openApplicationDatabase,
  resolveAppDataDirectory,
} from "./sqliteD1";
import { canonicalRedirect } from "./canonicalRedirect";
import { renderRouteHeroPreload } from "./resourceHints";
import { publicRobots, type MetadataContext } from "../client/src/lib/siteMetadata";
import { escapeHtml, renderPageMetadata } from "./pageMetadata";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_SITE_URL = "https://downsizebaltimore.com";

function configuredSiteOrigin() {
  const url = new URL(process.env.SITE_URL || DEFAULT_SITE_URL);
  return url.origin;
}

function requestOrigin(req: Request) {
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto === "http" || forwardedProto === "https"
    ? forwardedProto : req.protocol === "http" ? "http" : "https";
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

function renderDocument(
  template: string,
  req: Request,
  routePath: string | null,
  article?: PublicInsightPost | null,
) {
  const context: MetadataContext = {
    siteOrigin: configuredSiteOrigin(),
    requestOrigin: requestOrigin(req),
    indexable: isIndexableRequest(req),
    initialPath: req.path,
    initialResolvedPath: routePath,
    initialArticle: article ? {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
    } : null,
  };
  return renderPageMetadata(template, context)
    .replace("<!--__ROUTE_RESOURCE_HINTS__-->", renderRouteHeroPreload(routePath));
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
  const dataDirectory = resolveAppDataDirectory();
  const database = openApplicationDatabase(dataDirectory);
  const apiEnvironment: ApiEnvironment = {
    DB: database,
    BLOG_LOGIN_USERNAME: process.env.BLOG_LOGIN_USERNAME,
    BLOG_LOGIN_PASSWORD_HASH: process.env.BLOG_LOGIN_PASSWORD_HASH,
    mediaDirectory: path.join(dataDirectory, "media"),
  };

  console.log(`Persistent application data: ${dataDirectory}`);
  if (
    !apiEnvironment.BLOG_LOGIN_USERNAME ||
    !apiEnvironment.BLOG_LOGIN_PASSWORD_HASH
  ) {
    console.warn(
      "Publisher login is disabled until BLOG_LOGIN_USERNAME and BLOG_LOGIN_PASSWORD_HASH are configured.",
    );
  }

  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    // Resolve dynamic article aliases first in the HTML handler so a host,
    // case/slash and saved-slug change all share the same final destination.
    if (articleSlugFromPath(req.path)) return next();
    const canonicalPath = req.path.toLowerCase() === "/index.html"
      ? "/"
      : ["/robots.txt", "/sitemap.xml"].includes(req.path)
        ? req.path
        : canonicalizeRecognizedPath(req.path);
    const redirect = canonicalRedirect({
      method: req.method,
      host: req.get("host"),
      protocol: req.protocol,
      originalUrl: req.originalUrl,
      canonicalPath,
      siteOrigin: configuredSiteOrigin(),
      enabled: process.env.NODE_ENV === "production" &&
        process.env.SITE_INDEXABLE?.trim().toLowerCase() !== "false",
    });
    if (redirect) return res.redirect(308, redirect);

    next();
  });

  app.get("/robots.txt", (req, res) => {
    res.set("Cache-Control", "public, max-age=3600");
    res.type("text/plain");
    return res.send(publicRobots(isIndexableRequest(req), configuredSiteOrigin()));
  });

  app.all("/api/*", async (req, res) => {
    res.set("X-Robots-Tag", "noindex");
    try {
      await sendWebResponse(
        res,
        await handleGodaddyApi(
          expressRequestToWebRequest(req),
          apiEnvironment,
        ),
      );
    } catch (error) {
      console.error("Unable to process API request", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "The service encountered a problem." });
      }
    }
  });

  app.all("/media/insights/:id", async (req, res) => {
    try {
      await serveInsightImage(req, res, apiEnvironment, req.params.id);
    } catch (error) {
      console.error("Unable to serve insight image", error);
      if (!res.headersSent) res.sendStatus(500);
    }
  });

  app.get(["/media/pop-family-video.mp4"], (_req, res) => {
    res.sendFile(
      path.join(
        staticPath,
        "manus-storage",
        "pop-with-music-20261007.mp4",
      ),
      {
        headers: {
          "Cache-Control": "public, max-age=86400",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  });

  app.get("/sitemap.xml", async (_req, res) => {
    res.set("Cache-Control", "public, max-age=3600");
    res.type("application/xml");
    const origin = configuredSiteOrigin();
    const staticUrls = PAGE_ROUTES.filter(
      (route) => !("indexable" in route) || route.indexable !== false,
    ).map(
      (route) =>
        `  <url><loc>${escapeHtml(new URL(route.path, `${origin}/`).href)}</loc></url>`,
    );
    let articleUrls: string[] = [];
    try {
      articleUrls = (await listPublishedPostSlugs(database)).map(
        ({ slug, updatedAt }) =>
          `  <url><loc>${escapeHtml(new URL(`/insights-advice/${slug}`, `${origin}/`).href)}</loc><lastmod>${escapeHtml(updatedAt)}</lastmod></url>`,
      );
    } catch (error) {
      console.error("Unable to include insights in sitemap", error);
    }
    const urls = [...staticUrls, ...articleUrls].join("\n");
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

  app.get("*", async (req, res) => {
    const route = findPageRoute(req.path);
    const articleSlug = articleSlugFromPath(req.path);
    let article: PublicInsightPost | null = null;
    if (articleSlug) {
      try {
        article = await getPublishedPostBySlug(database, articleSlug);
        if (article) {
          const redirect = canonicalRedirect({
            method: req.method,
            host: req.get("host"),
            protocol: req.protocol,
            originalUrl: req.originalUrl,
            canonicalPath: `/insights-advice/${article.slug}`,
            siteOrigin: configuredSiteOrigin(),
            enabled: process.env.NODE_ENV === "production" &&
              process.env.SITE_INDEXABLE?.trim().toLowerCase() !== "false",
          });
          if (redirect) return res.redirect(308, redirect);
        }
      } catch (error) {
        console.error("Unable to load article metadata", error);
      }
    }
    const recognizedPath = route?.path ?? (article ? req.path : null);
    res.set("Cache-Control", route?.path === "/publisher" ? "private, no-store" : "no-cache, must-revalidate");
    if (!recognizedPath) res.status(404);
    res
      .type("html")
      .send(renderDocument(indexTemplate, req, recognizedPath, article));
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
