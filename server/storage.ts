import { db } from "./db";
import {
  calculations,
  users,
  type InsertCalculation,
  type Calculation,
  type User,
  type QueryParams,
  type PaginatedResponse,
  type Statistics,
  type ProjectStatistics
} from "@shared/schema";
import { desc, eq, and, gte, lte, sql, count } from "drizzle-orm";
import { hashPassword, generateResetToken } from "./auth";

export interface IStorage {
  // User operations
  createUser(email: string, password: string, name: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: number): Promise<User | null>;
  updateUserProfile(userId: number, course: string | null, year: number | null): Promise<User>;
  setResetPasswordToken(email: string, token: string, expires: Date): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<User | null>;
  
  // Calculation operations (now user-specific)
  createCalculation(userId: number, calculation: InsertCalculation): Promise<Calculation>;
  getCalculations(userId: number, params?: QueryParams): Promise<PaginatedResponse>;
  getStatistics(userId: number): Promise<Statistics>;
  
  // Public statistics
  getProjectStatistics(): Promise<ProjectStatistics>;
  getAllCalculations(): Promise<Calculation[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async createUser(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        isFirstLogin: true,
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user || null;
  }

  async getUserById(id: number): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  }

  async updateUserProfile(userId: number, course: string | null, year: number | null): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        course,
        year,
        isFirstLogin: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async setResetPasswordToken(email: string, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      })
      .where(eq(users.email, email));
  }

  async resetPassword(token: string, newPassword: string): Promise<User | null> {
    const hashedPassword = await hashPassword(newPassword);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token))
      .limit(1);

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return null;
    }

    const [updated] = await db
      .update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where(eq(users.id, user.id))
      .returning();

    return updated || null;
  }

  // Calculation operations (user-specific)
  async createCalculation(userId: number, insertCalculation: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db
      .insert(calculations)
      .values({
        ...insertCalculation,
        userId,
      })
      .returning();
    return calculation;
  }

  async getCalculations(userId: number, params?: QueryParams): Promise<PaginatedResponse> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;

    // Build where conditions (always filter by userId)
    const conditions = [eq(calculations.userId, userId)];
    
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

    const whereClause = and(...conditions);

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

  async getStatistics(userId: number): Promise<Statistics> {
    const all = await db
      .select()
      .from(calculations)
      .where(eq(calculations.userId, userId));
    
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

  // Public project statistics
  async getProjectStatistics(): Promise<ProjectStatistics> {
    const allUsers = await db.select().from(users);
    const allCalculations = await db.select().from(calculations);

    // Statistics by course
    const byCourse: Record<string, number> = {};
    allUsers.forEach(user => {
      if (user.course) {
        byCourse[user.course] = (byCourse[user.course] || 0) + 1;
      }
    });

    // Statistics by year
    const byYear: Record<string, number> = {};
    allUsers.forEach(user => {
      if (user.year) {
        byYear[user.year.toString()] = (byYear[user.year.toString()] || 0) + 1;
      }
    });

    // Statistics by type
    const byType = {
      energy: allCalculations.filter(c => c.type === 'energy').length,
      network: allCalculations.filter(c => c.type === 'network').length,
      cpu: allCalculations.filter(c => c.type === 'cpu').length,
    };

    // Average result
    const results = allCalculations.map(c => Number(c.result));
    const averageResult = results.length > 0 
      ? results.reduce((a, b) => a + b, 0) / results.length 
      : 0;

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = allCalculations.filter(c => 
      c.createdAt && new Date(c.createdAt) >= sevenDaysAgo
    );

    // Group by date
    const activityByDate: Record<string, number> = {};
    recent.forEach(calc => {
      if (calc.createdAt) {
        const date = new Date(calc.createdAt).toISOString().split('T')[0];
        activityByDate[date] = (activityByDate[date] || 0) + 1;
      }
    });

    const recentActivity = Object.entries(activityByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalUsers: allUsers.length,
      totalCalculations: allCalculations.length,
      byCourse,
      byYear,
      byType,
      averageResult,
      recentActivity,
    };
  }

  async getAllCalculations(): Promise<Calculation[]> {
    return await db.select().from(calculations).orderBy(desc(calculations.createdAt));
  }
}

export const storage = new DatabaseStorage();
