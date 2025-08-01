import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  stores, 
  products, 
  profiles, 
  adminStoreAssignments,
  type Store, 
  type Product, 
  type Profile, 
  type AdminStoreAssignment,
  type InsertStore,
  type InsertProduct, 
  type InsertProfile,
  type InsertAdminStoreAssignment
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

export interface IStorage {
  // Stores
  getStores(): Promise<Store[]>;
  getStore(id: string): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: string, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByStore(storeId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Profiles
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Admin Store Assignments
  getAdminStoreAssignments(adminId: string): Promise<AdminStoreAssignment[]>;
  createAdminStoreAssignment(assignment: InsertAdminStoreAssignment): Promise<AdminStoreAssignment>;
  deleteAdminStoreAssignment(adminId: string, storeId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Stores
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStore(id: string): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.id, id));
    return result[0];
  }

  async createStore(store: InsertStore): Promise<Store> {
    const result = await db.insert(stores).values(store).returning();
    return result[0];
  }

  async updateStore(id: string, store: Partial<InsertStore>): Promise<Store | undefined> {
    const result = await db.update(stores).set(store).where(eq(stores.id, id)).returning();
    return result[0];
  }

  async deleteStore(id: string): Promise<boolean> {
    const result = await db.delete(stores).where(eq(stores.id, id));
    return result.length > 0;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByStore(storeId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.storeId, storeId));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.length > 0;
  }

  // Profiles
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id));
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email));
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db.update(profiles).set(profile).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  // Admin Store Assignments
  async getAdminStoreAssignments(adminId: string): Promise<AdminStoreAssignment[]> {
    return await db.select().from(adminStoreAssignments).where(eq(adminStoreAssignments.adminId, adminId));
  }

  async createAdminStoreAssignment(assignment: InsertAdminStoreAssignment): Promise<AdminStoreAssignment> {
    const result = await db.insert(adminStoreAssignments).values(assignment).returning();
    return result[0];
  }

  async deleteAdminStoreAssignment(adminId: string, storeId: string): Promise<boolean> {
    const result = await db.delete(adminStoreAssignments)
      .where(and(
        eq(adminStoreAssignments.adminId, adminId),
        eq(adminStoreAssignments.storeId, storeId)
      ));
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
