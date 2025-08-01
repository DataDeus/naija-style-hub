import { pgTable, text, uuid, decimal, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["SUPERADMIN", "ADMIN", "USER"]);

// Tables
export const stores = pgTable("stores", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
  size: text("size"),
  color: text("color"),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: userRoleEnum("role").default("USER").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminStoreAssignments = pgTable("admin_store_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  adminAssignments: many(adminStoreAssignments),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  adminStoreAssignments: many(adminStoreAssignments),
}));

export const adminStoreAssignmentsRelations = relations(adminStoreAssignments, ({ one }) => ({
  admin: one(profiles, {
    fields: [adminStoreAssignments.adminId],
    references: [profiles.id],
  }),
  store: one(stores, {
    fields: [adminStoreAssignments.storeId],
    references: [stores.id],
  }),
}));

// Insert schemas
export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  price: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'string' ? val : val.toString()
  )
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertAdminStoreAssignmentSchema = createInsertSchema(adminStoreAssignments).omit({
  id: true,
  createdAt: true,
});

// Types
export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type AdminStoreAssignment = typeof adminStoreAssignments.$inferSelect;
export type InsertAdminStoreAssignment = z.infer<typeof insertAdminStoreAssignmentSchema>;

// Legacy types for compatibility
export type User = Profile;
export type InsertUser = InsertProfile;
