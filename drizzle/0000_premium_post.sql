CREATE TABLE `insight_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`author_email` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_insight_posts_slug` ON `insight_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_insight_posts_publication` ON `insight_posts` (`status`,`published_at`,`id`);