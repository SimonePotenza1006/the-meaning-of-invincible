CREATE TABLE "combatants" (
	"id" serial PRIMARY KEY NOT NULL,
	"encounter_id" integer NOT NULL,
	"name" text NOT NULL,
	"side" text NOT NULL,
	"source_type" text NOT NULL,
	"character_id" integer,
	"monster_index" text,
	"max_hp" integer,
	"current_hp" integer,
	"ac" integer,
	"init_mod" integer DEFAULT 0 NOT NULL,
	"initiative" integer,
	"conditions" jsonb DEFAULT '[]'::jsonb,
	"statblock" jsonb,
	"hidden" boolean DEFAULT false NOT NULL,
	"defeated" boolean DEFAULT false NOT NULL,
	"sort_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encounters" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"name" text NOT NULL,
	"terrain" text DEFAULT 'plains' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"round" integer DEFAULT 0 NOT NULL,
	"turn_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "combatants" ADD CONSTRAINT "combatants_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;