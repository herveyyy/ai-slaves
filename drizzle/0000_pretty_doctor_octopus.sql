CREATE TABLE `action_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`process_id` integer,
	`agent_id` integer,
	`skill_used` text NOT NULL,
	`input` text,
	`output` text,
	`timestamp` integer,
	FOREIGN KEY (`process_id`) REFERENCES `processes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `agent_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer,
	`skill_name` text NOT NULL,
	`is_allowed` integer DEFAULT true,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_index` integer NOT NULL,
	`model_type` text DEFAULT 'flash',
	`role` text NOT NULL,
	`status` text DEFAULT 'idle',
	`last_used` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agents_account_index_unique` ON `agents` (`account_index`);--> statement-breakpoint
CREATE TABLE `memories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`process_id` integer,
	`department` text NOT NULL,
	`agent_role` text NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`created_at` integer,
	FOREIGN KEY (`process_id`) REFERENCES `processes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `processes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`department` text NOT NULL,
	`workflow` text NOT NULL,
	`status` text DEFAULT 'idle',
	`current_stage` text,
	`config` text,
	`created_at` integer
);
