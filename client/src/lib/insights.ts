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
  signInUrl?: string;
};

export type ApiErrorPayload = {
  error?: string;
  fields?: Record<string, string>;
};

export class InsightsApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string>;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.error || "Something went wrong. Please try again.");
    this.name = "InsightsApiError";
    this.status = status;
    this.fields = payload.fields ?? {};
  }
}

export async function insightsRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as T & ApiErrorPayload)
    : ({ error: "The publishing service is unavailable." } as T & ApiErrorPayload);

  if (!response.ok) throw new InsightsApiError(response.status, payload);
  return payload;
}

export function formatInsightDate(value: string | null) {
  if (!value) return "Unpublished";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function dateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);
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
