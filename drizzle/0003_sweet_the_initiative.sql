CREATE TABLE `insight_addresses` (
	`slug` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `insight_images` (
	`id` text PRIMARY KEY NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `insight_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`snapshot` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_insight_revisions_post_created` ON `insight_revisions` (`post_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `publisher_credentials` (
	`username` text PRIMARY KEY NOT NULL,
	`password_hash` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `publisher_recovery` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`snapshot` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `insight_posts` ADD `deleted_at` integer;