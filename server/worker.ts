import {
  NOT_FOUND_METADATA,
  PAGE_ROUTES,
  articleSlugFromPath,
  canonicalizeRecognizedPath,
  findPageRoute,
} from "../client/src/lib/siteRoutes";
import { RESOURCE_GUIDES, guidePdfPath } from "../client/src/lib/resourceGuides";
import {
  PostConflictError,
  PostNotFoundError,
  PostValidationError,
  createPost,
  deletePost,
  getPublishedPostBySlug,
  listAdminPosts,
  listPublishedPostSlugs,
  listPublishedPosts,
  updatePost,
  type PostWriteInput,
  type PublicInsightPost,
} from "./posts";

const DEFAULT_SITE_URL = "https://downsizebaltimore.com";
const SOCIAL_IMAGE_PATH = "/downsize-baltimore-social-share.jpg";
const SOCIAL_IMAGE_ALT =
  "Downsize Baltimore — clear housing guidance from Mary Lynch";
const SIGN_IN_URL = "/signin-with-chatgpt?return_to=%2Fpublisher";
const MAX_JSON_BODY_BYTES = 100_000;

type AssetBinding = {
  fetch(request: Request): Promise<Response>;
};

type WorkerEnv = {
  ASSETS: AssetBinding;
  DB: D1Database;
  SITE_INDEXABLE?: string;
  SITE_URL?: string;
  BLOG_ADMIN_USER_IDS?: string;
  BLOG_ADMIN_EMAILS?: string;
  DEV_BLOG_ADMIN?: string;
};

type AuthenticatedUser = {
  userId: string;
  email: string;
  displayName: string;
};

type RenderMetadata = {
  path: string | null;
  title: string;
  description: string;
  indexable: boolean;
  ogType?: "website" | "article";
  publishedAt?: string | null;
  includeSocialImage?: boolean;
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
  metadata: RenderMetadata,
) {
  const indexable = metadata.indexable && isIndexableRequest(request, env);
  const requestOrigin = new URL(request.url).origin;
  const origin = indexable ? configuredSiteOrigin(env) : requestOrigin;
  const canonicalUrl = metadata.path
    ? new URL(metadata.path, `${origin}/`).href
    : null;
  const socialImageUrl = new URL(SOCIAL_IMAGE_PATH, `${origin}/`).href;
  const robots = indexable ? "index,follow" : "noindex,nofollow";
  const includeSocialImage = metadata.includeSocialImage !== false;
  const twitterCard = includeSocialImage ? "summary_large_image" : "summary";

  return [
    `<meta name="robots" content="${robots}" />`,
    canonicalUrl
      ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
      : "",
    `<meta property="og:type" content="${metadata.ogType ?? "website"}" />`,
    '<meta property="og:site_name" content="Downsize Baltimore" />',
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    canonicalUrl
      ? `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
      : "",
    metadata.ogType === "article" && metadata.publishedAt
      ? `<meta property="article:published_time" content="${escapeHtml(metadata.publishedAt)}" />`
      : "",
    includeSocialImage
      ? `<meta property="og:image" content="${escapeHtml(socialImageUrl)}" />`
      : "",
    includeSocialImage
      ? '<meta property="og:image:width" content="1200" />'
      : "",
    includeSocialImage
      ? '<meta property="og:image:height" content="630" />'
      : "",
    includeSocialImage
      ? `<meta property="og:image:alt" content="${escapeHtml(SOCIAL_IMAGE_ALT)}" />`
      : "",
    `<meta name="twitter:card" content="${twitterCard}" />`,
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
    includeSocialImage
      ? `<meta name="twitter:image" content="${escapeHtml(socialImageUrl)}" />`
      : "",
    includeSocialImage
      ? `<meta name="twitter:image:alt" content="${escapeHtml(SOCIAL_IMAGE_ALT)}" />`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");
}

function renderDocument(
  template: string,
  request: Request,
  env: WorkerEnv,
  metadata: RenderMetadata,
) {
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
      metadataMarkup(request, env, metadata),
    );
}

function staticMetadata(pathname: string): RenderMetadata | null {
  const route = findPageRoute(pathname);
  if (!route) return null;
  return {
    path: route.path,
    title: route.title,
    description: route.description,
    indexable: route.indexable !== false,
  };
}

function articleMetadata(post: PublicInsightPost): RenderMetadata {
  return {
    path: `/insights-advice/${post.slug}`,
    title: `${post.title} | Downsize Baltimore`,
    description: post.excerpt,
    indexable: true,
    ogType: "article",
    publishedAt: post.publishedAt,
    includeSocialImage: false,
  };
}

function notFoundMetadata(): RenderMetadata {
  return {
    path: null,
    title: NOT_FOUND_METADATA.title,
    description: NOT_FOUND_METADATA.description,
    indexable: false,
  };
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
  cacheControl = "public, max-age=3600",
) {
  return new Response(method === "HEAD" ? null : body, {
    status,
    headers: {
      "Cache-Control": cacheControl,
      "Content-Type": contentType,
    },
  });
}

function jsonResponse(payload: unknown, request: Request, status = 200) {
  return new Response(request.method === "HEAD" ? null : JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function renderRoute(
  request: Request,
  env: WorkerEnv,
  metadata: RenderMetadata,
  status = 200,
) {
  const indexRequest = new Request(new URL("/index.html", request.url), {
    method: "GET",
    headers: request.headers,
  });
  let templateResponse = await env.ASSETS.fetch(indexRequest);
  if (!templateResponse.ok) {
    templateResponse = await env.ASSETS.fetch(
      new Request(new URL("/client/index.html", request.url), {
        method: "GET",
        headers: request.headers,
      }),
    );
  }
  if (!templateResponse.ok) {
    return new Response("Site shell unavailable", { status: 503 });
  }

  const html = renderDocument(
    await templateResponse.text(),
    request,
    env,
    metadata,
  );
  return new Response(request.method === "HEAD" ? null : html, {
    status,
    headers: {
      "Cache-Control": "no-cache, must-revalidate",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function localPublisherEnabled(request: Request, env: WorkerEnv) {
  const hostname = new URL(request.url).hostname;
  return (
    env.DEV_BLOG_ADMIN === "true" &&
    (hostname === "localhost" || hostname === "127.0.0.1")
  );
}

function decodeFullName(request: Request) {
  const encoded = request.headers.get("oai-authenticated-user-full-name");
  if (
    !encoded ||
    request.headers.get("oai-authenticated-user-full-name-encoding") !==
      "percent-encoded-utf-8"
  ) {
    return null;
  }
  try {
    return decodeURIComponent(encoded);
  } catch {
    return null;
  }
}

function authenticatedUser(
  request: Request,
  env: WorkerEnv,
): AuthenticatedUser | null {
  if (localPublisherEnabled(request, env)) {
    return {
      userId: "local-publisher",
      email: "local.publisher@downsizebaltimore.test",
      displayName: "Local Publisher",
    };
  }

  const userId = request.headers.get("oai-authenticated-user-id");
  const email = request.headers.get("oai-authenticated-user-email");
  if (!userId || !email) return null;
  return {
    userId,
    email,
    displayName: decodeFullName(request) ?? email,
  };
}

function allowlist(value: string | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );
}

function decodePathSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function isAuthorizedPublisher(
  request: Request,
  env: WorkerEnv,
  user: AuthenticatedUser | null,
) {
  if (!user) return false;
  if (localPublisherEnabled(request, env)) return true;
  const userIds = allowlist(env.BLOG_ADMIN_USER_IDS);
  const emails = allowlist(env.BLOG_ADMIN_EMAILS);
  return (
    userIds.has(user.userId.toLowerCase()) ||
    emails.has(user.email.toLowerCase())
  );
}

function sameOriginMutation(request: Request) {
  if (request.headers.get("x-downsize-publisher") !== "1") return false;
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return false;
  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin";
}

async function readJsonBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new PostValidationError({ request: "Send the post as JSON." });
  }
  const declaredLength = Number(request.headers.get("content-length") || "0");
  if (declaredLength > MAX_JSON_BODY_BYTES) {
    throw new PostValidationError({ body: "This article is too large." });
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BODY_BYTES) {
    throw new PostValidationError({ body: "This article is too large." });
  }
  try {
    return JSON.parse(text) as PostWriteInput;
  } catch {
    throw new PostValidationError({ request: "The post data is not valid JSON." });
  }
}

async function handleApi(request: Request, env: WorkerEnv) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!env.DB) {
    return jsonResponse(
      { error: "The publishing service is temporarily unavailable." },
      request,
      503,
    );
  }

  try {
    if (pathname === "/api/posts" && (request.method === "GET" || request.method === "HEAD")) {
      const requestedLimit = Number(url.searchParams.get("limit") || "20");
      const requestedOffset = Number(url.searchParams.get("offset") || "0");
      const limit = Number.isFinite(requestedLimit)
        ? Math.max(1, Math.min(Math.trunc(requestedLimit), 50))
        : 20;
      const offset = Number.isFinite(requestedOffset)
        ? Math.max(0, Math.min(Math.trunc(requestedOffset), 100_000))
        : 0;
      const page = await listPublishedPosts(
        env.DB,
        limit + 1,
        offset,
      );
      const hasMore = page.length > limit;
      return jsonResponse(
        {
          posts: page.slice(0, limit),
          pagination: {
            hasMore,
            nextOffset: hasMore ? offset + limit : null,
          },
        },
        request,
      );
    }

    const publicPostMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
    if (publicPostMatch && (request.method === "GET" || request.method === "HEAD")) {
      const decodedSlug = decodePathSegment(publicPostMatch[1]);
      const slug = decodedSlug?.toLowerCase() ?? "";
      if (!decodedSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return jsonResponse({ error: "Article not found." }, request, 404);
      }
      const post = await getPublishedPostBySlug(env.DB, slug);
      return post
        ? jsonResponse({ post }, request)
        : jsonResponse({ error: "Article not found." }, request, 404);
    }

    if (pathname === "/api/admin/session" && (request.method === "GET" || request.method === "HEAD")) {
      const user = authenticatedUser(request, env);
      const authorized = isAuthorizedPublisher(request, env, user);
      return jsonResponse(
        {
          authenticated: Boolean(user),
          authorized,
          displayName: user?.displayName ?? null,
          email: user?.email ?? null,
          ...(!user ? { signInUrl: SIGN_IN_URL } : {}),
        },
        request,
        user && !authorized ? 403 : user ? 200 : 401,
      );
    }

    if (pathname.startsWith("/api/admin/")) {
      const user = authenticatedUser(request, env);
      if (!user) return jsonResponse({ error: "Sign in to continue." }, request, 401);
      if (!isAuthorizedPublisher(request, env, user)) {
        return jsonResponse({ error: "This account does not have publishing access." }, request, 403);
      }

      if (pathname === "/api/admin/posts" && (request.method === "GET" || request.method === "HEAD")) {
        return jsonResponse({ posts: await listAdminPosts(env.DB) }, request);
      }

      if (pathname === "/api/admin/posts" && request.method === "POST") {
        if (!sameOriginMutation(request)) {
          return jsonResponse({ error: "This publishing request was blocked." }, request, 403);
        }
        const post = await createPost(env.DB, await readJsonBody(request), user.email);
        return jsonResponse({ post }, request, 201);
      }

      const adminPostMatch = pathname.match(/^\/api\/admin\/posts\/([^/]+)$/);
      if (adminPostMatch) {
        const id = decodePathSegment(adminPostMatch[1]);
        if (!id || !/^[a-z0-9-]{8,64}$/i.test(id)) {
          return jsonResponse({ error: "Post not found." }, request, 404);
        }
        if (request.method === "PUT") {
          if (!sameOriginMutation(request)) {
            return jsonResponse({ error: "This publishing request was blocked." }, request, 403);
          }
          const post = await updatePost(env.DB, id, await readJsonBody(request));
          return jsonResponse({ post }, request);
        }
        if (request.method === "DELETE") {
          if (!sameOriginMutation(request)) {
            return jsonResponse({ error: "This publishing request was blocked." }, request, 403);
          }
          await deletePost(env.DB, id);
          return jsonResponse({ success: true }, request);
        }
      }
    }

    return jsonResponse({ error: "API route not found." }, request, 404);
  } catch (error) {
    if (error instanceof PostValidationError) {
      return jsonResponse({ error: error.message, fields: error.fields }, request, 422);
    }
    if (error instanceof PostConflictError) {
      return jsonResponse({ error: error.message }, request, 409);
    }
    if (error instanceof PostNotFoundError) {
      return jsonResponse({ error: error.message }, request, 404);
    }
    console.error("Insights API error", error);
    return jsonResponse(
      { error: "The publishing service encountered a problem. Please try again." },
      request,
      500,
    );
  }
}

async function sitemapResponse(request: Request, env: WorkerEnv) {
  const origin = configuredSiteOrigin(env);
  const staticRoutes = PAGE_ROUTES.filter(
    (route) => !("indexable" in route) || route.indexable !== false,
  );
  let articleUrls: string[] = [];
  try {
    articleUrls = (await listPublishedPostSlugs(env.DB)).map(
      ({ slug, updatedAt }) =>
        `  <url><loc>${escapeHtml(new URL(`/insights-advice/${slug}`, `${origin}/`).href)}</loc><lastmod>${escapeHtml(updatedAt)}</lastmod></url>`,
    );
  } catch (error) {
    console.error("Unable to include insights in sitemap", error);
  }
  const urls = [
    ...staticRoutes.map(
      (route) =>
        `  <url><loc>${escapeHtml(new URL(route.path, `${origin}/`).href)}</loc></url>`,
    ),
    ...articleUrls,
  ].join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return textResponse(
    body,
    "application/xml; charset=utf-8",
    request.method,
    200,
    "no-cache, must-revalidate",
  );
}

export default {
  async fetch(request: Request, env: WorkerEnv) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    if (pathname.startsWith("/api/")) return handleApi(request, env);

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
        ? `User-agent: *\nAllow: /\nDisallow: /publisher\nDisallow: /api/\nSitemap: ${configuredSiteOrigin(env)}/sitemap.xml\n`
        : "User-agent: *\nDisallow: /\n";
      return textResponse(body, "text/plain; charset=utf-8", request.method);
    }

    if (pathname === "/sitemap.xml") return sitemapResponse(request, env);

    if (pathname === "/publisher") {
      const user = authenticatedUser(request, env);
      if (!user && !localPublisherEnabled(request, env)) {
        return Response.redirect(new URL(SIGN_IN_URL, request.url), 302);
      }
    }

    const articleSlug = articleSlugFromPath(pathname);
    if (articleSlug) {
      try {
        const post = await getPublishedPostBySlug(env.DB, articleSlug);
        return post
          ? renderRoute(request, env, articleMetadata(post))
          : renderRoute(request, env, notFoundMetadata(), 404);
      } catch (error) {
        console.error("Unable to render insight article", error);
        return renderRoute(
          request,
          env,
          {
            path: null,
            title: "Article Unavailable | Downsize Baltimore",
            description: "This article is temporarily unavailable.",
            indexable: false,
          },
          503,
        );
      }
    }

    const metadata = staticMetadata(pathname);
    if (metadata) return renderRoute(request, env, metadata);

    if (pathname.startsWith("/guides/") && pathname.toLowerCase().endsWith(".pdf")) {
      if (!RESOURCE_GUIDES.some((guide) => guidePdfPath(guide) === pathname)) {
        return textResponse("Guide not found.", "text/plain; charset=utf-8", request.method, 404, "no-store");
      }
      const pdf = await env.ASSETS.fetch(request);
      if (!pdf.ok || !pdf.headers.get("Content-Type")?.toLowerCase().startsWith("application/pdf")) {
        return textResponse("This guide is unavailable.", "text/plain; charset=utf-8", request.method, 404, "no-store");
      }
      return withCacheControl(pdf, pathname, request.method);
    }

    const looksLikeAsset =
      pathname.startsWith("/assets/") ||
      pathname.startsWith("/manus-storage/") ||
      pathname.startsWith("/captions/") ||
      pathname.startsWith("/@vite/") ||
      pathname === "/@react-refresh" ||
      pathname.startsWith("/@id/") ||
      pathname.startsWith("/@fs/") ||
      pathname.startsWith("/node_modules/") ||
      pathname.startsWith("/client/") ||
      pathname.startsWith("/src/") ||
      /\.[a-z0-9]+$/i.test(pathname);

    if (looksLikeAsset) {
      return withCacheControl(
        await env.ASSETS.fetch(request),
        pathname,
        request.method,
      );
    }

    return renderRoute(request, env, notFoundMetadata(), 404);
  },
};
