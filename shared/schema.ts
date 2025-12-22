import { pgTable, text, serial, numeric, timestamp } from "drizzle-orm/pg-core";
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

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Filter schema
export const filterSchema = z.object({
  type: z.enum(["energy", "network", "cpu"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  minResult: z.coerce.number().optional(),
  maxResult: z.coerce.number().optional(),
});

// Query schema (combines pagination and filters)
export const querySchema = paginationSchema.merge(filterSchema);

// Response schema with pagination metadata
export const paginatedResponseSchema = z.object({
  data: z.array(z.custom<typeof calculations.$inferSelect>()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

// Statistics schema
export const statisticsSchema = z.object({
  total: z.number(),
  byType: z.object({
    energy: z.number(),
    network: z.number(),
    cpu: z.number(),
  }),
  averageResult: z.number(),
  minResult: z.number(),
  maxResult: z.number(),
  dateRange: z.object({
    earliest: z.string().nullable(),
    latest: z.string().nullable(),
  }),
});

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type FilterParams = z.infer<typeof filterSchema>;
export type QueryParams = z.infer<typeof querySchema>;
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>;
export type Statistics = z.infer<typeof statisticsSchema>;
