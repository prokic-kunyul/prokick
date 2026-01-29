import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").default("USER").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

export const jerseys = sqliteTable("jerseys", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  team: text("team").notNull(),
  league: text("league").notNull(),
  season: text("season").notNull(),
  type: text("type").notNull(), // Home, Away, Third
  category: text("category").default("Jersey").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  image: text("image"),
  sizes: text("sizes").notNull(), // "S,M,L"
  stockData: text("stock_data").default("{}").notNull(), // JSON string
  stock: integer("stock").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

export const jerseyImages = sqliteTable("jersey_images", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  jerseyId: text("jersey_id").notNull().references(() => jerseys.id, { onDelete: 'cascade' }),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id),
  total: real("total").notNull(),
  status: text("status").default("PENDING").notNull(),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  jerseyId: text("jersey_id").notNull().references(() => jerseys.id),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull(),
  price: real("price").notNull(),
});

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  role: text("role"),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  avatar: text("avatar"),
  proofImage: text("proof_image"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const banners = sqliteTable("banners", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title"),
  image: text("image").notNull(),
  link: text("link"),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

// RELATIONS

import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  jersey: one(jerseys, {
    fields: [orderItems.jerseyId],
    references: [jerseys.id],
  }),
}));

export const jerseysRelations = relations(jerseys, ({ many }) => ({
  images: many(jerseyImages),
  items: many(orderItems),
}));

export const jerseyImagesRelations = relations(jerseyImages, ({ one }) => ({
  jersey: one(jerseys, {
    fields: [jerseyImages.jerseyId],
    references: [jerseys.id],
  }),
}));

