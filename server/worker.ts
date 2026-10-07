import {
  NOT_FOUND_METADATA,
  PAGE_ROUTES,
  articleSlugFromPath,
  canonicalizeRecognizedPath,
  findPageRoute,
} from "../client/src/lib/siteRoutes";
import { RESOURCE_GUIDES, guidePdfPath } from "../client/src/lib/resourceGuides";
import { publisherLogin, publisherLogout, publisherChangePassword, publisherUser, sameOriginMutation, type PublisherAuthEnv } from "./publisherAuth";
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
  postCursor,
  restorePost,
  listPostRevisions,
  updatePost,
  type PostWriteInput,
  type PublicInsightPost,
} from "./posts";

const DEFAULT_SITE_URL = "https://downsizebaltimore.com";
const SOCIAL_IMAGE_PATH = "/downsize-baltimore-social-share.jpg";
const SOCIAL_IMAGE_ALT =
  "Downsize Baltimore — clear housing guidance from Mary Lynch";
const MAX_JSON_BODY_BYTES = 500_000;

type AssetBinding = {
  fetch(request: Request): Promise<Response>;
};

type WorkerEnv = PublisherAuthEnv & {
  ASSETS: AssetBinding;
  DB: D1Database;
  MEDIA?: R2Bucket;
  SITE_INDEXABLE?: string;
  SITE_URL?: string;
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
  if (/^\/(?:@|client\/|src\/|node_modules\/)/.test(pathname)) return "no-store";
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
      "Cache-Control": metadata.path === "/publisher" ? "private, no-store" : "no-cache, must-revalidate",
      ...(metadata.path === "/publisher" ? { "X-Frame-Options": "DENY", "Content-Security-Policy": "frame-ancestors 'none'", "Referrer-Policy": "same-origin" } : {}),
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function decodePathSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
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
    const input = JSON.parse(text);
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error();
    return input as PostWriteInput;
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
    if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Use POST for this request." }, request, 405);
      }
      return pathname === "/api/admin/login"
        ? await publisherLogin(request, env)
        : await publisherLogout(request, env);
    }
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
        url.searchParams.get("cursor"),
      );
      const hasMore = page.length > limit;
      return jsonResponse(
        {
          posts: page.slice(0, limit),
          pagination: {
            hasMore,
            nextOffset: hasMore ? offset + limit : null,
            nextCursor: hasMore ? postCursor(page[limit - 1]) : null,
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
      const user = await publisherUser(request, env);
      return jsonResponse(
        {
          authenticated: Boolean(user),
          authorized: Boolean(user),
          displayName: user?.displayName ?? null,
          email: user?.email ?? null,
        },
        request,
        user ? 200 : 401,
      );
    }

    if (pathname.startsWith("/api/admin/")) {
      const user = await publisherUser(request, env);
      if (!user) return jsonResponse({ error: "Sign in to continue." }, request, 401);

      if (pathname === "/api/admin/password" && request.method === "POST") return publisherChangePassword(request, env);
      if (pathname === "/api/admin/images" && request.method === "POST") return uploadInsightImage(request, env);

      const recoveryMatch = pathname.match(/^\/api\/admin\/recovery\/([a-f0-9-]{36})$/);
      if (recoveryMatch) {
        const id = recoveryMatch[1];
        if (request.method === "GET") {
          const row = await env.DB.prepare("SELECT snapshot FROM publisher_recovery WHERE id = ? AND username = ? AND updated_at > ?").bind(id, user.email, Date.now() - 30 * 86400000).first<{ snapshot: string }>();
          return jsonResponse({ recovery: row ? JSON.parse(row.snapshot) : null }, request);
        }
        if (!sameOriginMutation(request)) return jsonResponse({ error: "This request was blocked." }, request, 403);
        if (request.method === "PUT") {
          const input = await readJsonBody(request) as unknown as { snapshot?: unknown; writtenAt?: unknown };
          if (!input.snapshot || typeof input.snapshot !== "object" || !Number.isSafeInteger(input.writtenAt) || Math.abs(Number(input.writtenAt) - Date.now()) > 300000) throw new PostValidationError({ request: "Invalid recovery draft." });
          await env.DB.prepare("INSERT INTO publisher_recovery (id, username, snapshot, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET snapshot = excluded.snapshot, updated_at = excluded.updated_at WHERE publisher_recovery.username = excluded.username AND publisher_recovery.updated_at <= excluded.updated_at")
            .bind(id, user.email, JSON.stringify(input.snapshot), input.writtenAt).run();
          return jsonResponse({ success: true }, request);
        }
      }

      const postActionMatch = pathname.match(/^\/api\/admin\/posts\/([a-z0-9-]{8,64})\/(restore|revisions)$/i);
      if (postActionMatch) {
        if (postActionMatch[2] === "revisions" && request.method === "GET") return jsonResponse({ revisions: await listPostRevisions(env.DB, postActionMatch[1]) }, request);
        if (postActionMatch[2] === "restore" && request.method === "POST") {
          if (!sameOriginMutation(request)) return jsonResponse({ error: "This request was blocked." }, request, 403);
          return jsonResponse({ post: await restorePost(env.DB, postActionMatch[1]) }, request);
        }
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

async function uploadInsightImage(request: Request, env: WorkerEnv) {
  if (!sameOriginMutation(request)) return jsonResponse({ error: "This upload was blocked." }, request, 403);
  if (!env.MEDIA) return jsonResponse({ error: "Image uploads are temporarily unavailable." }, request, 503);
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data")) return jsonResponse({ error: "Choose an image to upload." }, request, 422);
  const reader = request.body?.getReader(); const chunks: Uint8Array[] = []; let length = 0;
  if (!reader) return jsonResponse({ error: "Choose an image to upload." }, request, 422);
  while (true) { const chunk = await reader.read(); if (chunk.done) break; length += chunk.value.byteLength;
    if (length > 5 * 1024 * 1024 + 65536) { await reader.cancel(); return jsonResponse({ error: "Choose an image smaller than 5 MB." }, request, 413); } chunks.push(chunk.value); }
  let data: FormData;
  try { data = await new Response(new Blob(chunks), { headers: { "Content-Type": contentType } }).formData(); }
  catch { return jsonResponse({ error: "The upload could not be read." }, request, 422); }
  const file = data.get("image");
  if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024) return jsonResponse({ error: "Choose an image smaller than 5 MB." }, request, 422);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const png = bytes.length > 8 && [137,80,78,71,13,10,26,10].every((b,i) => bytes[i] === b);
  const jpeg = bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = bytes.length > 12 && new TextDecoder().decode(bytes.slice(0,4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8,12)) === "WEBP";
  const type = png ? "image/png" : jpeg ? "image/jpeg" : webp ? "image/webp" : null;
  if (!type || file.type !== type) return jsonResponse({ error: "Use a PNG, JPEG, or WebP image. SVG and other files are not supported." }, request, 422);
  const id = crypto.randomUUID();
  await env.MEDIA.put(`insights/${id}`, bytes, { httpMetadata: { contentType: type } });
  try { await env.DB.prepare("INSERT INTO insight_images (id, content_type, size, created_at) VALUES (?, ?, ?, ?)").bind(id, type, bytes.length, Date.now()).run(); }
  catch (error) { await env.MEDIA.delete(`insights/${id}`); throw error; }
  return jsonResponse({ url: `/media/insights/${id}` }, request, 201);
}

async function insightImage(request: Request, env: WorkerEnv, id: string) {
  const metadata = await env.DB.prepare("SELECT content_type, size FROM insight_images WHERE id = ?").bind(id).first<{ content_type: string; size: number }>();
  if (!metadata || !env.MEDIA) return new Response("Image not found", { status: 404 });
  const path = `/media/insights/${id}`;
  const published = await env.DB.prepare("SELECT id FROM insight_posts WHERE status = 'published' AND deleted_at IS NULL AND published_at <= ? AND instr(body, ?) > 0 LIMIT 1").bind(Date.now(), path).first();
  if (!published && !(await publisherUser(request, env))) return new Response("Image not found", { status: 404 });
  const object = await env.MEDIA.get(`insights/${id}`);
  if (!object) return new Response("Image not found", { status: 404 });
  return new Response(request.method === "HEAD" ? null : object.body, { headers: {
    "Content-Type": metadata.content_type, "Content-Length": String(metadata.size), "X-Content-Type-Options": "nosniff",
    "Cache-Control": published ? "public, max-age=60" : "private, no-store", ETag: object.httpEtag,
  } });
}

async function familyVideo(request: Request, env: WorkerEnv) {
  const total = 9001545;
  const headers = new Headers({ "Content-Type": "video/mp4", "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" });
  const range = request.headers.get("Range");
  let start = 0; let end = total - 1;
  if (range && request.method !== "HEAD") {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) { headers.set("Content-Range", `bytes */${total}`); return new Response(null, { status: 416, headers }); }
    start = match[1] ? Number(match[1]) : Math.max(0, total - Number(match[2]));
    end = match[1] && match[2] ? Math.min(Number(match[2]), total - 1) : total - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= total) { headers.set("Content-Range", `bytes */${total}`); return new Response(null, { status: 416, headers }); }
    headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
  }
  headers.set("Content-Length", String(end - start + 1));
  if (request.method === "HEAD") return new Response(null, { headers });
  const source = await env.ASSETS.fetch(new Request(new URL("/manus-storage/pop-with-music-20261007.mp4", request.url)));
  if (!source.ok || !source.body) return new Response("Video unavailable", { status: 503 });
  if (!range) return new Response(source.body, { headers });
  const reader = source.body.getReader(); let position = 0;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) { controller.close(); return; }
          const chunkStart = position; position += chunk.value.byteLength;
          if (position <= start) continue;
          const slice = chunk.value.subarray(Math.max(0, start - chunkStart), Math.min(chunk.value.byteLength, end + 1 - chunkStart));
          if (slice.length) controller.enqueue(slice);
          if (position > end) { controller.close(); await reader.cancel(); }
          return;
        }
      } catch (error) { controller.error(error); }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
  return new Response(body, { status: 206, headers });
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
    if (pathname === "/media/pop-family-video.mp4") return familyVideo(request, env);
    const imageMatch = pathname.match(/^\/media\/insights\/([a-f0-9-]{36})$/);
    if (imageMatch) {
      try { return await insightImage(request, env, imageMatch[1]); }
      catch (error) { console.error("Image unavailable", error); return new Response("Image unavailable", { status: 503 }); }
    }

    const articleSlug = articleSlugFromPath(pathname);
    if (articleSlug) {
      try {
        const post = await getPublishedPostBySlug(env.DB, articleSlug);
        if (post && post.slug !== articleSlug) return Response.redirect(new URL(`/insights-advice/${post.slug}${search}`, request.url), 308);
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
