import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import crypto from "crypto";

const PgSession = connectPgSimple(session);

// Configure Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const normalizedEmail = email.trim().toLowerCase();
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, normalizedEmail))
          .limit(1);

        if (!user) {
          console.log(`[Passport] User not found: ${normalizedEmail}`);
          return done(null, false, { message: "Email ou senha incorretos" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          console.log(`[Passport] Invalid password for: ${normalizedEmail}`);
          return done(null, false, { message: "Email ou senha incorretos" });
        }

        console.log(`[Passport] Login successful for: ${normalizedEmail}`);
        return done(null, user);
      } catch (error: any) {
        console.error(`[Passport] Error: ${error.message}`);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      console.log(`[Passport] Deserialize: User ${id} not found`);
      return done(null, null);
    }

    console.log(`[Passport] Deserialize: User ${id} loaded`);
    done(null, user);
  } catch (error: any) {
    console.error(`[Passport] Deserialize error: ${error.message}`);
    done(error);
  }
});

// Setup session middleware
export function setupAuth(app: Express) {
  const sessionMiddleware = session({
    store: new PgSession({
      pool: pool as any,
      tableName: "session",
      createTableIfMissing: true, // Auto-create table if missing
    }),
    secret: process.env.SESSION_SECRET || "change-this-secret-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "lax", // Help with CORS
    },
    name: "connect.sid", // Explicit session name
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  // Debug middleware
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/auth")) {
      console.log(`[Session] ${req.method} ${req.path} - isAuthenticated: ${req.isAuthenticated()}, user: ${req.user ? (req.user as any).id : 'none'}`);
    }
    next();
  });
}

// Middleware to check if user is authenticated
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Não autenticado" });
}

// Helper to hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Helper to generate reset token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Helper to get current user from request
export function getCurrentUser(req: Request) {
  return req.user as any;
}

