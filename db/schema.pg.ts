

import { text, integer, pgTable, real, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").default("USER").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const jerseys = pgTable("jerseys", {
  id: uuid("id").primaryKey().defaultRandom(),
  team: text("team").notNull(),
  league: text("league").notNull(),
  season: text("season").notNull(),
  type: text("type").notNull(), 
  category: text("category").default("Jersey").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  image: text("image"),
  sizes: text("sizes").notNull(),
  stockData: text("stock_data").default("{}").notNull(),
  stock: integer("stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const jerseyImages = pgTable("jersey_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  jerseyId: uuid("jersey_id").notNull().references(() => jerseys.id, { onDelete: 'cascade' }),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  total: real("total").notNull(),
  status: text("status").default("PENDING").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  jerseyId: uuid("jersey_id").notNull().references(() => jerseys.id),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull(),
  price: real("price").notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role"),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  avatar: text("avatar"),
  proofImage: text("proof_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const banners = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  image: text("image").notNull(),
  link: text("link"),
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
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
