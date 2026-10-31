import { type User, type InsertUser, type NutritionAnalysis, type InsertNutritionAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Nutrition analysis methods
  createNutritionAnalysis(analysis: InsertNutritionAnalysis): Promise<NutritionAnalysis>;
  getNutritionAnalysis(id: string): Promise<NutritionAnalysis | undefined>;
  getRecentNutritionAnalyses(limit?: number): Promise<NutritionAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private nutritionAnalyses: Map<string, NutritionAnalysis>;

  constructor() {
    this.users = new Map();
    this.nutritionAnalyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createNutritionAnalysis(insertAnalysis: InsertNutritionAnalysis): Promise<NutritionAnalysis> {
    const id = randomUUID();
    const analysis: NutritionAnalysis = { 
      ...insertAnalysis, 
      id,
      imageUrl: insertAnalysis.imageUrl || null,
      createdAt: new Date().toISOString()
    };
    this.nutritionAnalyses.set(id, analysis);
    return analysis;
  }

  async getNutritionAnalysis(id: string): Promise<NutritionAnalysis | undefined> {
    return this.nutritionAnalyses.get(id);
  }

  async getRecentNutritionAnalyses(limit: number = 10): Promise<NutritionAnalysis[]> {
    const analyses = Array.from(this.nutritionAnalyses.values());
    return analyses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();