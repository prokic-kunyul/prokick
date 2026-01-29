ALTER TABLE "order_items" ADD COLUMN "custom_name" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "custom_number" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "custom_patch" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_phone" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_zone" text;