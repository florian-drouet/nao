CREATE TABLE `project_mcp_config` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`disabled_tools` text DEFAULT '[]' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_mcp_config_projectId_idx` ON `project_mcp_config` (`project_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_mcp_config_projectId_unique` ON `project_mcp_config` (`project_id`);