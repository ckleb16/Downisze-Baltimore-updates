CREATE TABLE `publisher_login_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_publisher_login_attempts_expiry` ON `publisher_login_attempts` (`expires_at`);--> statement-breakpoint
CREATE TABLE `publisher_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`credential_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_publisher_sessions_expiry` ON `publisher_sessions` (`expires_at`);