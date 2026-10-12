import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { createReadStream } from "node:fs";
import { mkdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import {
  PostConflictError,
  PostNotFoundError,
  PostValidationError,
  createPost,
  deletePost,
  getPublishedPostBySlug,
  listAdminPosts,
  listPostRevisions,
  listPublishedPosts,
  postCursor,
  restorePost,
  updatePost,
  type PostWriteInput,
} from "./posts";
import {
  publisherChangePassword,
  publisherLogin,
  publisherLogout,
  publisherUser,
  sameOriginMutation,
  type PublisherAuthEnv,
} from "./publisherAuth";

const MAX_JSON_BODY_BYTES = 500_000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

class BodyTooLargeError extends Error {}

async function limitedBody(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const next = await reader.read();
    if (next.done) break;
    size += next.value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(next.value);
  }
  return new Uint8Array(Buffer.concat(chunks));
}

type ApiEnvironment = PublisherAuthEnv & {
  mediaDirectory: string;
};

function jsonResponse(payload: unknown, request: Request, status = 200) {
  return new Response(
    request.method === "HEAD" ? null : JSON.stringify(payload),
    {
      status,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function decodePathSegment(segment: string) {
  try {
    const decoded = decodeURIComponent(segment);
    return decoded.includes("/") || decoded.includes("\\") ? null : decoded;
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
  let text: string;
  try {
    text = new TextDecoder().decode(await limitedBody(request, MAX_JSON_BODY_BYTES));
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      throw new PostValidationError({ body: "This article is too large." });
    }
    throw error;
  }
  try {
    const input = JSON.parse(text);
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error();
    return input as PostWriteInput;
  } catch {
    throw new PostValidationError({ request: "The post data is not valid JSON." });
  }
}

async function uploadInsightImage(request: Request, env: ApiEnvironment) {
  if (!sameOriginMutation(request)) {
    return jsonResponse({ error: "This upload was blocked." }, request, 403);
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data")) {
    return jsonResponse({ error: "Choose an image to upload." }, request, 422);
  }
  const declaredLength = Number(request.headers.get("content-length") || "0");
  if (declaredLength > MAX_IMAGE_BYTES + 65_536) {
    return jsonResponse(
      { error: "Choose an image smaller than 5 MB." },
      request,
      413,
    );
  }

  let data: FormData;
  try {
    const bytes = await limitedBody(request, MAX_IMAGE_BYTES + 65_536);
    data = await new Response(bytes, { headers: { "Content-Type": contentType } }).formData();
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return jsonResponse({ error: "Choose an image smaller than 5 MB." }, request, 413);
    }
    return jsonResponse({ error: "The upload could not be read." }, request, 422);
  }
  const file = data.get("image");
  if (!(file instanceof File) || !file.size || file.size > MAX_IMAGE_BYTES) {
    return jsonResponse(
      { error: "Choose an image smaller than 5 MB." },
      request,
      422,
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const png =
    bytes.length > 8 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) =>
      bytes[index] === byte,
    );
  const jpeg =
    bytes.length > 3 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255;
  const webp =
    bytes.length > 12 &&
    new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
    new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  const verifiedType = png
    ? "image/png"
    : jpeg
      ? "image/jpeg"
      : webp
        ? "image/webp"
        : null;
  if (!verifiedType || file.type !== verifiedType) {
    return jsonResponse(
      { error: "Use a PNG, JPEG, or WebP image. SVG and other files are not supported." },
      request,
      422,
    );
  }

  const id = crypto.randomUUID();
  await mkdir(env.mediaDirectory, { recursive: true });
  const target = path.join(env.mediaDirectory, id);
  await writeFile(target, bytes, { flag: "wx" });
  try {
    await env.DB.prepare(
      "INSERT INTO insight_images (id, content_type, size, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind(id, verifiedType, bytes.length, Date.now())
      .run();
  } catch (error) {
    await unlink(target).catch(() => undefined);
    throw error;
  }
  return jsonResponse({ url: `/media/insights/${id}` }, request, 201);
}

export async function handleGodaddyApi(
  request: Request,
  env: ApiEnvironment,
) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Use POST for this request." }, request, 405);
      }
      return pathname === "/api/admin/login"
        ? publisherLogin(request, env)
        : publisherLogout(request, env);
    }

    if (
      pathname === "/api/posts" &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
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
    if (
      publicPostMatch &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
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

    if (
      pathname === "/api/admin/session" &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
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
      if (!user) {
        return jsonResponse({ error: "Sign in to continue." }, request, 401);
      }

      if (pathname === "/api/admin/password" && request.method === "POST") {
        return publisherChangePassword(request, env);
      }
      if (pathname === "/api/admin/images" && request.method === "POST") {
        return uploadInsightImage(request, env);
      }

      const recoveryMatch = pathname.match(
        /^\/api\/admin\/recovery\/([a-f0-9-]{36})$/,
      );
      if (recoveryMatch) {
        const id = recoveryMatch[1];
        if (request.method === "GET") {
          const row = await env.DB.prepare(
            "SELECT snapshot FROM publisher_recovery WHERE id = ? AND username = ? AND updated_at > ?",
          )
            .bind(id, user.email, Date.now() - 30 * 86_400_000)
            .first<{ snapshot: string }>();
          return jsonResponse(
            { recovery: row ? JSON.parse(row.snapshot) : null },
            request,
          );
        }
        if (!sameOriginMutation(request)) {
          return jsonResponse({ error: "This request was blocked." }, request, 403);
        }
        if (request.method === "PUT") {
          const input = (await readJsonBody(request)) as unknown as {
            snapshot?: unknown;
            writtenAt?: unknown;
          };
          if (
            !input.snapshot ||
            typeof input.snapshot !== "object" ||
            !Number.isSafeInteger(input.writtenAt) ||
            Math.abs(Number(input.writtenAt) - Date.now()) > 300_000
          ) {
            throw new PostValidationError({ request: "Invalid recovery draft." });
          }
          await env.DB.prepare(
            "INSERT INTO publisher_recovery (id, username, snapshot, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET snapshot = excluded.snapshot, updated_at = excluded.updated_at WHERE publisher_recovery.username = excluded.username AND publisher_recovery.updated_at <= excluded.updated_at",
          )
            .bind(id, user.email, JSON.stringify(input.snapshot), input.writtenAt)
            .run();
          return jsonResponse({ success: true }, request);
        }
      }

      const postActionMatch = pathname.match(
        /^\/api\/admin\/posts\/([a-z0-9-]{8,64})\/(restore|revisions)$/i,
      );
      if (postActionMatch) {
        if (
          postActionMatch[2] === "revisions" &&
          request.method === "GET"
        ) {
          return jsonResponse(
            { revisions: await listPostRevisions(env.DB, postActionMatch[1]) },
            request,
          );
        }
        if (
          postActionMatch[2] === "restore" &&
          request.method === "POST"
        ) {
          if (!sameOriginMutation(request)) {
            return jsonResponse({ error: "This request was blocked." }, request, 403);
          }
          return jsonResponse(
            { post: await restorePost(env.DB, postActionMatch[1]) },
            request,
          );
        }
      }

      if (
        pathname === "/api/admin/posts" &&
        (request.method === "GET" || request.method === "HEAD")
      ) {
        return jsonResponse({ posts: await listAdminPosts(env.DB) }, request);
      }

      if (pathname === "/api/admin/posts" && request.method === "POST") {
        if (!sameOriginMutation(request)) {
          return jsonResponse(
            { error: "This publishing request was blocked." },
            request,
            403,
          );
        }
        const post = await createPost(
          env.DB,
          await readJsonBody(request),
          user.email,
        );
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
            return jsonResponse(
              { error: "This publishing request was blocked." },
              request,
              403,
            );
          }
          const post = await updatePost(
            env.DB,
            id,
            await readJsonBody(request),
          );
          return jsonResponse({ post }, request);
        }
        if (request.method === "DELETE") {
          if (!sameOriginMutation(request)) {
            return jsonResponse(
              { error: "This publishing request was blocked." },
              request,
              403,
            );
          }
          await deletePost(env.DB, id);
          return jsonResponse({ success: true }, request);
        }
      }
    }

    return jsonResponse({ error: "API route not found." }, request, 404);
  } catch (error) {
    if (error instanceof PostValidationError) {
      return jsonResponse(
        { error: error.message, fields: error.fields },
        request,
        422,
      );
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

function requestProtocol(req: ExpressRequest) {
  return req.get("x-forwarded-proto")?.split(",")[0]?.trim() || req.protocol;
}

export function expressRequestToWebRequest(req: ExpressRequest) {
  const host = req.get("host") || "127.0.0.1";
  const url = `${requestProtocol(req)}://${host}${req.originalUrl}`;
  const headers = new Headers();
  for (let index = 0; index < req.rawHeaders.length; index += 2) {
    const name = req.rawHeaders[index];
    const value = req.rawHeaders[index + 1];
    if (name && value) headers.append(name, value);
  }
  // Replace client-supplied IP headers with Express's proxy-aware address.
  headers.set("cf-connecting-ip", req.ip || "unknown");
  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers,
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = Readable.toWeb(req) as ReadableStream;
    init.duplex = "half";
  }
  return new Request(url, init);
}

export async function sendWebResponse(
  res: ExpressResponse,
  response: Response,
) {
  res.status(response.status);
  response.headers.forEach((value, name) => res.setHeader(name, value));
  if (!response.body) return res.end();
  return res.send(Buffer.from(await response.arrayBuffer()));
}

export async function serveInsightImage(
  req: ExpressRequest,
  res: ExpressResponse,
  env: ApiEnvironment,
  id: string,
) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.sendStatus(405);
  }
  if (!/^[a-f0-9-]{36}$/.test(id)) return res.sendStatus(404);
  const metadata = await env.DB.prepare(
    "SELECT content_type, size FROM insight_images WHERE id = ?",
  )
    .bind(id)
    .first<{ content_type: string; size: number }>();
  if (!metadata) return res.sendStatus(404);

  const mediaPath = `/media/insights/${id}`;
  const published = await env.DB.prepare(
    "SELECT id FROM insight_posts WHERE status = 'published' AND deleted_at IS NULL AND published_at <= ? AND instr(body, ?) > 0 LIMIT 1",
  )
    .bind(Date.now(), mediaPath)
    .first<{ id: string }>();
  if (!published) {
    const user = await publisherUser(expressRequestToWebRequest(req), env);
    if (!user) return res.sendStatus(404);
  }

  const filename = path.join(env.mediaDirectory, id);
  let fileStats;
  try {
    fileStats = await stat(filename);
  } catch {
    return res.sendStatus(404);
  }
  if (!fileStats.isFile() || fileStats.size !== metadata.size) {
    return res.sendStatus(404);
  }

  res.setHeader("Content-Type", metadata.content_type);
  res.setHeader("Content-Length", String(metadata.size));
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Cache-Control",
    published ? "public, max-age=60" : "private, no-store",
  );
  res.setHeader("ETag", `\"${id}-${metadata.size}\"`);
  if (req.method === "HEAD") return res.end();
  createReadStream(filename).pipe(res);
}

export type { ApiEnvironment };
