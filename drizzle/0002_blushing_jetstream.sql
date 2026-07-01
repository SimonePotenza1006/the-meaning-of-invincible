ALTER TABLE "campaigns" ADD COLUMN "dm_notes" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "npcs" jsonb DEFAULT '[]'::jsonb NOT NULL;