export type PostStatus = "draft" | "published";

export type InsightSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: PostStatus;
  publishedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type InsightPost = InsightSummary & {
  body: string;
  authorEmail?: string;
};

export type PublisherSession = {
  authenticated: boolean;
  authorized: boolean;
  displayName: string | null;
  email: string | null;
};

export type ApiErrorPayload = {
  error?: string;
  fields?: Record<string, string>;
};

export class InsightsApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string>;

  constructor(status: number, payload: ApiErrorPayload) {
    super(typeof payload?.error === "string" ? payload.error : "Something went wrong. Please try again.");
    this.name = "InsightsApiError";
    this.status = status;
    this.fields = payload?.fields && typeof payload.fields === "object" ? Object.fromEntries(Object.entries(payload.fields).filter(([,value]) => typeof value === "string")) : {};
  }
}

export async function insightsRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timeout = window.setTimeout(abort, options.method && options.method !== "GET" ? 30000 : 20000);
  try {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    ...options,
    signal: controller.signal,
    headers: {
      Accept: "application/json",
      ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new InsightsApiError(502, { error: "The publishing service returned an unexpected response. Please try again." });
  }
  let payload: T & ApiErrorPayload;
  try { payload = await response.json(); }
  catch { throw new InsightsApiError(502, { error: "The publishing service returned an unreadable response." }); }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new InsightsApiError(502, { error: "The publishing service returned incomplete data." });

  if (!response.ok) throw new InsightsApiError(response.status, payload);
  validateResponse(url, options.method ?? "GET", payload);
  return payload;
  } catch (error) {
    if (controller.signal.aborted) throw new InsightsApiError(408, { error: options.method && options.method !== "GET"
      ? "The request timed out. It may have completed; reload the library before trying again. Your text is still here."
      : "The request took too long. Please try again." });
    throw error;
  } finally {
    window.clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abort);
  }
}

function validateResponse(url: string, method: string, payload: unknown) {
  const data = payload as Record<string, unknown> | null;
  let valid = Boolean(data && typeof data === "object" && !Array.isArray(data));
  const path = url.split("?")[0];
  const isPost = (item: unknown, body = false) => {
    const p = item as InsightPost | null;
    return p && typeof p.id === "string" && /^[a-z0-9-]{8,64}$/i.test(p.id) && typeof p.slug === "string" && typeof p.title === "string" &&
      typeof p.excerpt === "string" && (!body || typeof p.body === "string") &&
      (p.status === "draft" || p.status === "published") && Number.isInteger(p.version) && p.version > 0 &&
      [p.createdAt, p.updatedAt].every(d => typeof d === "string" && Number.isFinite(Date.parse(d))) &&
      (p.publishedAt === null || (typeof p.publishedAt === "string" && Number.isFinite(Date.parse(p.publishedAt))));
  };
  if (valid && (/\/session$|\/login$/.test(path))) valid = typeof data!.authenticated === "boolean" && typeof data!.authorized === "boolean" &&
    [data!.displayName,data!.email].every(value => value === null || typeof value === "string") && (!data!.authorized || data!.authenticated === true);
  else if (valid && method === "GET" && /\/posts$/.test(path)) {
    valid = Array.isArray(data!.posts) && data!.posts.every(p => isPost(p, path.includes("admin")));
    if (valid && path === "/api/posts") {
      const pagination = data!.pagination as { hasMore?: unknown; nextCursor?: unknown } | undefined;
      valid = Boolean(pagination && typeof pagination.hasMore === "boolean" &&
        (pagination.hasMore ? typeof pagination.nextCursor === "string" && pagination.nextCursor.length > 0 : pagination.nextCursor === null));
    }
  } else if (valid && /^\/api\/(?:admin\/)?posts\/[^/]+$/.test(path) && method !== "DELETE") valid = Boolean(isPost(data!.post, true));
  else if (valid && path === "/api/admin/posts" && method === "POST") valid = Boolean(isPost(data!.post, true));
  else if (valid && method === "GET" && path.endsWith("/revisions")) valid = Array.isArray(data!.revisions) && data!.revisions.every(item => {
    const r = item as { id?: unknown; post?: unknown; savedAt?: unknown };
    return r && typeof r.id === "string" && isPost(r.post,true) && typeof r.savedAt === "string" && Number.isFinite(Date.parse(r.savedAt));
  });
  if (!valid) throw new InsightsApiError(502, { error: "The publishing service returned incomplete data. Please try again." });
}

export function formatInsightDate(value: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Unpublished";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function dateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function slugifyInsight(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
}
