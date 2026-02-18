CREATE TABLE "project_mcp_config" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"disabled_tools" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_mcp_config_projectId_unique" UNIQUE("project_id")
);
--> statement-breakpoint
ALTER TABLE "project_mcp_config" ADD CONSTRAINT "project_mcp_config_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_mcp_config_projectId_idx" ON "project_mcp_config" USING btree ("project_id");