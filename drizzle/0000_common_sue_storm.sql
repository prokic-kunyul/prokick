CREATE TABLE IF NOT EXISTS "accessories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team" text NOT NULL,
	"league" text NOT NULL,
	"season" text DEFAULT '-' NOT NULL,
	"type" text NOT NULL,
	"category" text DEFAULT 'Produk Lainnya' NOT NULL,
	"price" real NOT NULL,
	"description" text,
	"image" text,
	"sizes" text NOT NULL,
	"stock_data" text DEFAULT '{}' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);

CREATE TABLE IF NOT EXISTS "shoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team" text NOT NULL,
	"league" text NOT NULL,
	"season" text DEFAULT '-' NOT NULL,
	"type" text NOT NULL,
	"category" text DEFAULT 'Sepatu' NOT NULL,
	"price" real NOT NULL,
	"description" text,
	"image" text,
	"sizes" text NOT NULL,
	"stock_data" text DEFAULT '{}' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);

CREATE TABLE IF NOT EXISTS "windbreakers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team" text NOT NULL,
	"league" text NOT NULL,
	"season" text DEFAULT '-' NOT NULL,
	"type" text NOT NULL,
	"category" text DEFAULT 'Windbreaker' NOT NULL,
	"price" real NOT NULL,
	"description" text,
	"image" text,
	"sizes" text NOT NULL,
	"stock_data" text DEFAULT '{}' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);

ALTER TABLE "order_items" ALTER COLUMN "jersey_id" DROP NOT NULL;
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "shoe_id" uuid REFERENCES "public"."shoes"("id");
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "windbreaker_id" uuid REFERENCES "public"."windbreakers"("id");
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "accessory_id" uuid REFERENCES "public"."accessories"("id");