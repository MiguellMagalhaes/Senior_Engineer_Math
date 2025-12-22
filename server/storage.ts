import { db } from "./db";
import {
  calculations,
  type InsertCalculation,
  type Calculation,
  type QueryParams,
  type PaginatedResponse,
  type Statistics
} from "@shared/schema";
import { desc, eq, and, gte, lte, sql, count } from "drizzle-orm";

export interface IStorage {
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculations(params?: QueryParams): Promise<PaginatedResponse>;
  getStatistics(): Promise<Statistics>;
  getAllCalculations(): Promise<Calculation[]>;
}

export class DatabaseStorage implements IStorage {
  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db
      .insert(calculations)
      .values(insertCalculation)
      .returning();
    return calculation;
  }

  async getCalculations(params?: QueryParams): Promise<PaginatedResponse> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    
    if (params?.type) {
      conditions.push(eq(calculations.type, params.type));
    }
    
    if (params?.dateFrom) {
      conditions.push(gte(calculations.createdAt, new Date(params.dateFrom)));
    }
    
    if (params?.dateTo) {
      conditions.push(lte(calculations.createdAt, new Date(params.dateTo)));
    }
    
    if (params?.minResult !== undefined) {
      conditions.push(gte(calculations.result, params.minResult.toString()));
    }
    
    if (params?.maxResult !== undefined) {
      conditions.push(lte(calculations.result, params.maxResult.toString()));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(calculations)
      .where(whereClause);
    
    const total = Number(totalResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const data = await db
      .select()
      .from(calculations)
      .where(whereClause)
      .orderBy(desc(calculations.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getStatistics(): Promise<Statistics> {
    const all = await db.select().from(calculations);
    
    const byType = {
      energy: all.filter(c => c.type === 'energy').length,
      network: all.filter(c => c.type === 'network').length,
      cpu: all.filter(c => c.type === 'cpu').length,
    };

    const results = all.map(c => Number(c.result));
    const averageResult = results.length > 0 
      ? results.reduce((a, b) => a + b, 0) / results.length 
      : 0;
    const minResult = results.length > 0 ? Math.min(...results) : 0;
    const maxResult = results.length > 0 ? Math.max(...results) : 0;

    const dates = all.map(c => c.createdAt?.toISOString()).filter(Boolean) as string[];
    const dateRange = {
      earliest: dates.length > 0 ? dates.sort()[0] : null,
      latest: dates.length > 0 ? dates.sort().reverse()[0] : null,
    };

    return {
      total: all.length,
      byType,
      averageResult,
      minResult,
      maxResult,
      dateRange,
    };
  }

  async getAllCalculations(): Promise<Calculation[]> {
    return await db.select().from(calculations).orderBy(desc(calculations.createdAt));
  }
}

export const storage = new DatabaseStorage();
