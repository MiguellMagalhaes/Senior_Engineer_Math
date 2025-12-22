import { pgTable, text, serial, numeric, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // hashed
  name: text("name").notNull(),
  course: text("course"), // Curso (ex: "Engenharia Informática")
  year: integer("year"), // Ano de faculdade (1, 2, 3, etc.)
  isFirstLogin: boolean("is_first_login").default(true),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// We will store calculation history for didactic purposes
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'energy', 'network', 'cpu'
  functionExpression: text("function_expression").notNull(),
  t1: numeric("t1").notNull(),
  t2: numeric("t2").notNull(),
  result: numeric("result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({ 
  id: true, 
  createdAt: true,
  userId: true // Will be set from session
});

// Email validation regex (more flexible)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User schemas
export const registerSchema = z.object({
  email: z.string()
    .min(1, "Email é obrigatório")
    .transform((val) => val.trim().toLowerCase())
    .refine((val) => emailRegex.test(val), {
      message: "Email inválido. Use um formato válido como: exemplo@email.com"
    }),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome é muito longo")
    .transform((val) => val.trim()),
});

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email é obrigatório")
    .transform((val) => val.trim().toLowerCase())
    .refine((val) => emailRegex.test(val), {
      message: "Email inválido"
    }),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const updateProfileSchema = z.object({
  course: z.string().min(1, "Curso é obrigatório").optional(),
  year: z.coerce.number().int().min(1).max(10).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email é obrigatório")
    .transform((val) => val.trim().toLowerCase())
    .refine((val) => emailRegex.test(val), {
      message: "Email inválido"
    }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
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

// Statistics schema (user-specific)
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

// Public project statistics schema
export const projectStatisticsSchema = z.object({
  totalUsers: z.number(),
  totalCalculations: z.number(),
  byCourse: z.record(z.number()),
  byYear: z.record(z.number()),
  byType: z.object({
    energy: z.number(),
    network: z.number(),
    cpu: z.number(),
  }),
  averageResult: z.number(),
  recentActivity: z.array(z.object({
    date: z.string(),
    count: z.number(),
  })),
});

export type User = typeof users.$inferSelect;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type FilterParams = z.infer<typeof filterSchema>;
export type QueryParams = z.infer<typeof querySchema>;
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>;
export type Statistics = z.infer<typeof statisticsSchema>;
export type ProjectStatistics = z.infer<typeof projectStatisticsSchema>;
