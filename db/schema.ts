

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

export const shoes = pgTable("shoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  team: text("team").notNull(), // Brand/Model Name
  league: text("league").notNull(), // Brand Category
  season: text("season").default("-").notNull(),
  type: text("type").notNull(), 
  category: text("category").default("Sepatu").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  image: text("image"),
  sizes: text("sizes").notNull(),
  stockData: text("stock_data").default("{}").notNull(),
  stock: integer("stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const windbreakers = pgTable("windbreakers", {
  id: uuid("id").primaryKey().defaultRandom(),
  team: text("team").notNull(), // Name
  league: text("league").notNull(), // Brand
  season: text("season").default("-").notNull(),
  type: text("type").notNull(), 
  category: text("category").default("Windbreaker").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  image: text("image"),
  sizes: text("sizes").notNull(),
  stockData: text("stock_data").default("{}").notNull(),
  stock: integer("stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const accessories = pgTable("accessories", {
  id: uuid("id").primaryKey().defaultRandom(),
  team: text("team").notNull(), // Name
  league: text("league").notNull(), // Brand
  season: text("season").default("-").notNull(),
  type: text("type").notNull(), 
  category: text("category").default("Produk Lainnya").notNull(),
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
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  shippingAddress: text("shipping_address"),
  shippingZone: text("shipping_zone"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  jerseyId: uuid("jersey_id").references(() => jerseys.id),
  shoeId: uuid("shoe_id").references(() => shoes.id),
  windbreakerId: uuid("windbreaker_id").references(() => windbreakers.id),
  accessoryId: uuid("accessory_id").references(() => accessories.id),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull(),
  price: real("price").notNull(),
  customName: text("custom_name"),
  customNumber: text("custom_number"),
  customPatch: text("custom_patch"),
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
  shoe: one(shoes, {
    fields: [orderItems.shoeId],
    references: [shoes.id],
  }),
  windbreaker: one(windbreakers, {
    fields: [orderItems.windbreakerId],
    references: [windbreakers.id],
  }),
  accessory: one(accessories, {
    fields: [orderItems.accessoryId],
    references: [accessories.id],
  }),
}));

export const jerseysRelations = relations(jerseys, ({ many }) => ({
  images: many(jerseyImages),
  items: many(orderItems),
}));

export const shoesRelations = relations(shoes, ({ many }) => ({
  items: many(orderItems)
}));

export const windbreakersRelations = relations(windbreakers, ({ many }) => ({
  items: many(orderItems)
}));

export const accessoriesRelations = relations(accessories, ({ many }) => ({
  items: many(orderItems)
}));

export const jerseyImagesRelations = relations(jerseyImages, ({ one }) => ({
  jersey: one(jerseys, {
    fields: [jerseyImages.jerseyId],
    references: [jerseys.id],
  }),
}));
