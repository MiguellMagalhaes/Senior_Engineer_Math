import { pgTable, text, serial, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We will store calculation history for didactic purposes
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'energy', 'network', 'cpu'
  functionExpression: text("function_expression").notNull(),
  t1: numeric("t1").notNull(),
  t2: numeric("t2").notNull(),
  result: numeric("result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({ 
  id: true, 
  createdAt: true 
});

// Input Schemas for the Frontend Forms
export const calculationInputSchema = z.object({
  functionExpression: z.string().min(1, "Function expression is required (e.g., 100 + 20*t)"),
  t1: z.coerce.number().describe("Start time"),
  t2: z.coerce.number().describe("End time"),
}).refine(data => data.t2 > data.t1, {
  message: "End time must be greater than start time",
  path: ["t2"]
});

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
