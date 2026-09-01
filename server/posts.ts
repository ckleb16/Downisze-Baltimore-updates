export type PostStatus = "draft" | "published";

export type InsightPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  publishedAt: string | null;
  authorEmail: string;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type InsightSummary = Omit<InsightPost, "body" | "authorEmail">;
export type PublicInsightPost = Omit<InsightPost, "authorEmail">;

export type PostWriteInput = {
  title?: unknown;
  slug?: unknown;
  excerpt?: unknown;
  body?: unknown;
  status?: unknown;
  publishedAt?: unknown;
  version?: unknown;
};

type InsightRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  published_at: number | null;
  author_email: string;
  version: number;
  created_at: number;
  updated_at: number;
};

type ValidatedPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  publishedAt: number | null;
  version: number | null;
};

export class PostValidationError extends Error {
  readonly fields: Record<string, string>;

  constructor(fields: Record<string, string>) {
    super("Please correct the highlighted fields.");
    this.name = "PostValidationError";
    this.fields = fields;
  }
}

export class PostConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostConflictError";
  }
}

export class PostNotFoundError extends Error {
  constructor() {
    super("Post not found.");
    this.name = "PostNotFoundError";
  }
}

const CREATE_POSTS_TABLE = `
  CREATE TABLE IF NOT EXISTS insight_posts (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at INTEGER,
    author_email TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )
`;
const CREATE_SLUG_INDEX = `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_insight_posts_slug
  ON insight_posts(slug)
`;
const CREATE_PUBLICATION_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_insight_posts_publication
  ON insight_posts(status, published_at DESC, id DESC)
`;

const SELECT_COLUMNS = `
  id, slug, title, excerpt, body, status, published_at,
  author_email, version, created_at, updated_at
`;

const schemaPromises = new WeakMap<object, Promise<void>>();

export async function ensurePostsSchema(db: D1Database) {
  const key = db as unknown as object;
  const existing = schemaPromises.get(key);
  if (existing) return existing;

  const pending = db
    .batch([
      db.prepare(CREATE_POSTS_TABLE),
      db.prepare(CREATE_SLUG_INDEX),
      db.prepare(CREATE_PUBLICATION_INDEX),
      db.prepare("PRAGMA optimize"),
    ])
    .then(() => undefined)
    .catch((error) => {
      schemaPromises.delete(key);
      throw error;
    });

  schemaPromises.set(key, pending);
  return pending;
}

export function slugifyPostTitle(value: string) {
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

export async function listPublishedPosts(
  db: D1Database,
  limit = 20,
  offset = 0,
) {
  await ensurePostsSchema(db);
  const safeLimit = Math.max(1, Math.min(Math.trunc(limit), 51));
  const safeOffset = Math.max(0, Math.min(Math.trunc(offset), 100_000));
  const result = await db
    .prepare(
      `SELECT ${SELECT_COLUMNS}
       FROM insight_posts
       WHERE status = 'published' AND published_at IS NOT NULL
       ORDER BY published_at DESC, created_at DESC, id DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(safeLimit, safeOffset)
    .all<InsightRow>();

  return result.results.map(rowToSummary);
}

export async function listPublishedPostSlugs(db: D1Database) {
  await ensurePostsSchema(db);
  const result = await db
    .prepare(
      `SELECT slug, updated_at
       FROM insight_posts
       WHERE status = 'published' AND published_at IS NOT NULL
       ORDER BY published_at DESC, created_at DESC, id DESC`,
    )
    .all<{ slug: string; updated_at: number }>();

  return result.results.map((row) => ({
    slug: row.slug,
    updatedAt: new Date(row.updated_at).toISOString(),
  }));
}

export async function getPublishedPostBySlug(db: D1Database, slug: string) {
  await ensurePostsSchema(db);
  const row = await db
    .prepare(
      `SELECT ${SELECT_COLUMNS}
       FROM insight_posts
       WHERE slug = ? AND status = 'published' AND published_at IS NOT NULL
       LIMIT 1`,
    )
    .bind(slug)
    .first<InsightRow>();
  return row ? rowToPublicPost(row) : null;
}

export async function listAdminPosts(db: D1Database) {
  await ensurePostsSchema(db);
  const result = await db
    .prepare(
      `SELECT ${SELECT_COLUMNS}
       FROM insight_posts
       ORDER BY
         CASE WHEN published_at IS NULL THEN 1 ELSE 0 END,
         published_at DESC,
         updated_at DESC,
         id DESC`,
    )
    .all<InsightRow>();
  return result.results.map(rowToPost);
}

export async function createPost(
  db: D1Database,
  input: PostWriteInput,
  authorEmail: string,
) {
  await ensurePostsSchema(db);
  const post = validatePostInput(input);
  const now = Date.now();
  const id = crypto.randomUUID();

  try {
    await db
      .prepare(
        `INSERT INTO insight_posts (
          id, slug, title, excerpt, body, status, published_at,
          author_email, version, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      )
      .bind(
        id,
        post.slug,
        post.title,
        post.excerpt,
        post.body,
        post.status,
        post.publishedAt,
        authorEmail,
        now,
        now,
      )
      .run();
  } catch (error) {
    if (isUniqueSlugError(error)) {
      throw new PostConflictError("That URL slug is already in use.");
    }
    throw error;
  }

  return getAdminPostById(db, id);
}

export async function updatePost(
  db: D1Database,
  id: string,
  input: PostWriteInput,
) {
  await ensurePostsSchema(db);
  const post = validatePostInput(input, true);
  const now = Date.now();

  try {
    const result = await db
      .prepare(
        `UPDATE insight_posts
         SET slug = ?, title = ?, excerpt = ?, body = ?, status = ?,
             published_at = ?, version = version + 1, updated_at = ?
         WHERE id = ? AND version = ?`,
      )
      .bind(
        post.slug,
        post.title,
        post.excerpt,
        post.body,
        post.status,
        post.publishedAt,
        now,
        id,
        post.version,
      )
      .run();

    if (!result.meta.changes) {
      const exists = await db
        .prepare("SELECT id FROM insight_posts WHERE id = ? LIMIT 1")
        .bind(id)
        .first<{ id: string }>();
      if (!exists) throw new PostNotFoundError();
      throw new PostConflictError(
        "This post changed in another session. Reload it before saving again.",
      );
    }
  } catch (error) {
    if (isUniqueSlugError(error)) {
      throw new PostConflictError("That URL slug is already in use.");
    }
    throw error;
  }

  return getAdminPostById(db, id);
}

export async function deletePost(db: D1Database, id: string) {
  await ensurePostsSchema(db);
  const result = await db
    .prepare("DELETE FROM insight_posts WHERE id = ?")
    .bind(id)
    .run();
  if (!result.meta.changes) throw new PostNotFoundError();
}

async function getAdminPostById(db: D1Database, id: string) {
  const row = await db
    .prepare(
      `SELECT ${SELECT_COLUMNS}
       FROM insight_posts
       WHERE id = ?
       LIMIT 1`,
    )
    .bind(id)
    .first<InsightRow>();
  if (!row) throw new PostNotFoundError();
  return rowToPost(row);
}

function validatePostInput(input: PostWriteInput, requireVersion = false) {
  const title = stringValue(input.title);
  const requestedSlug = stringValue(input.slug);
  const slug = slugifyPostTitle(requestedSlug || title);
  const excerpt = stringValue(input.excerpt);
  const body = stringValue(input.body);
  const status = input.status === "published" ? "published" : input.status === "draft" ? "draft" : null;
  const fields: Record<string, string> = {};

  if (!title) fields.title = "Add a headline.";
  else if (title.length > 140) fields.title = "Keep the headline under 140 characters.";
  if (!slug) fields.slug = "Add a URL slug using letters, numbers, and hyphens.";
  else if (slug.length > 90) fields.slug = "Keep the URL slug under 90 characters.";
  if (!excerpt) fields.excerpt = "Add a short summary.";
  else if (excerpt.length > 320) fields.excerpt = "Keep the summary under 320 characters.";
  if (!body) fields.body = "Add the article text.";
  else if (body.length > 50_000) fields.body = "Keep the article under 50,000 characters.";
  if (!status) fields.status = "Choose draft or published.";

  let publishedAt: number | null = null;
  if (status === "published") {
    if (typeof input.publishedAt !== "string" || !input.publishedAt.trim()) {
      fields.publishedAt = "Choose a publication date.";
    } else {
      const parsed = Date.parse(input.publishedAt);
      if (!Number.isFinite(parsed)) fields.publishedAt = "Choose a valid publication date.";
      else publishedAt = parsed;
    }
  }

  let version: number | null = null;
  if (requireVersion) {
    if (!Number.isInteger(input.version) || Number(input.version) < 1) {
      fields.version = "Reload this post before saving it.";
    } else {
      version = Number(input.version);
    }
  }

  if (Object.keys(fields).length) throw new PostValidationError(fields);

  return {
    title,
    slug,
    excerpt,
    body,
    status: status as PostStatus,
    publishedAt,
    version,
  } satisfies ValidatedPostInput;
}

function rowToPost(row: InsightRow): InsightPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    status: row.status,
    publishedAt: row.published_at
      ? new Date(row.published_at).toISOString()
      : null,
    authorEmail: row.author_email,
    version: row.version,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function rowToSummary(row: InsightRow): InsightSummary {
  const { body: _body, authorEmail: _authorEmail, ...summary } = rowToPost(row);
  return summary;
}

function rowToPublicPost(row: InsightRow): PublicInsightPost {
  const { authorEmail: _authorEmail, ...post } = rowToPost(row);
  return post;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isUniqueSlugError(error: unknown) {
  return (
    error instanceof Error &&
    /unique constraint failed:\s*insight_posts\.slug/i.test(error.message)
  );
}
