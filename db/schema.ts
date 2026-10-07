import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const insightPosts = sqliteTable(
  "insight_posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull(),
    status: text("status", { enum: ["draft", "published"] })
      .notNull()
      .default("draft"),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    authorEmail: text("author_email").notNull(),
    version: integer("version").notNull().default(1),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
  },
  (table) => [
    uniqueIndex("idx_insight_posts_slug").on(table.slug),
    index("idx_insight_posts_publication").on(
      table.status,
      table.publishedAt,
      table.id,
    ),
  ],
);

export const insightAddresses = sqliteTable("insight_addresses", {
  slug: text("slug").primaryKey(),
  postId: text("post_id").notNull(),
});

export const insightRevisions = sqliteTable("insight_revisions", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull(),
  snapshot: text("snapshot").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [index("idx_insight_revisions_post_created").on(table.postId, table.createdAt)]);

export const publisherCredentials = sqliteTable("publisher_credentials", {
  username: text("username").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const publisherRecovery = sqliteTable("publisher_recovery", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  snapshot: text("snapshot").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const insightImages = sqliteTable("insight_images", {
  id: text("id").primaryKey(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const publisherSessions = sqliteTable("publisher_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  username: text("username").notNull(),
  credentialVersion: text("credential_version").notNull(),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, (table) => [index("idx_publisher_sessions_expiry").on(table.expiresAt)]);

export const publisherLoginAttempts = sqliteTable("publisher_login_attempts", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, (table) => [index("idx_publisher_login_attempts_expiry").on(table.expiresAt)]);
