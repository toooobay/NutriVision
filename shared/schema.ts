import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Nutrition analysis results
export const nutritionAnalyses = pgTable("nutrition_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  foodName: text("food_name").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  fiber: real("fiber").notNull(),
  sugar: real("sugar").notNull(),
  sodium: real("sodium").notNull(),
  confidence: real("confidence").notNull(),
  rating: text("rating").notNull(), // "Sangat Baik", "Baik", "Kurang"
  reason: text("reason").notNull(),
  suggestions: text("suggestions").array().notNull(),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNutritionAnalysisSchema = createInsertSchema(nutritionAnalyses).omit({
  id: true,
  createdAt: true,
});

export const nutritionAnalysisResponseSchema = z.object({
  foodName: z.string(),
  nutrition: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
    sugar: z.number(),
    sodium: z.number(),
  }),
  confidence: z.number(),
  rating: z.enum(["Sangat Baik", "Baik", "Kurang"]),
  reason: z.string(),
  suggestions: z.array(z.string()),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNutritionAnalysis = z.infer<typeof insertNutritionAnalysisSchema>;
export type NutritionAnalysis = typeof nutritionAnalyses.$inferSelect;
export type NutritionAnalysisResponse = z.infer<typeof nutritionAnalysisResponseSchema>;