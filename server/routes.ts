import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { querySchema } from "@shared/schema";
import { z } from "zod";
import { log } from "./index";
import { requireAuth, getCurrentUser, generateResetToken } from "./auth";
import nodemailer from "nodemailer";

// Email configuration (simplified - in production use proper SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ========== AUTH ROUTES ==========
  
  // Register
  app.post(api.auth.register.path, async (req, res) => {
    try {
      log(`Register attempt: ${JSON.stringify({ ...req.body, password: '***' })}`, "auth");
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByEmail(input.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Email já está em uso" });
      }

      const user = await storage.createUser(input.email, input.password, input.name);
      log(`User registered: id=${user.id}, email=${user.email}`, "auth");
      
      // Auto-login after registration
      return new Promise<void>((resolve) => {
        req.login(user, (err) => {
          if (err) {
            log(`Error during auto-login: ${err.message}`, "error");
            // User was created, but login failed - return user anyway
            res.status(201).json(user);
            resolve();
          } else {
            res.status(201).json(user);
            resolve();
          }
        });
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map(e => {
          if (e.code === "invalid_string" && e.validation === "email") {
            return "Email inválido. Por favor, verifique o formato do email.";
          }
          return e.message;
        });
        log(`Validation error: ${JSON.stringify(err.errors)}`, "validation");
        res.status(400).json({ message: errorMessages[0] || "Dados inválidos" });
        return;
      }
      log(`Error registering user: ${err instanceof Error ? err.message : 'Unknown error'}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login
  app.post(api.auth.login.path, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        log(`Login error: ${err.message}`, "error");
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
      if (!user) {
        log(`Login failed: ${info?.message || 'Credenciais inválidas'}`, "auth");
        return res.status(401).json({ message: info?.message || "Email ou senha incorretos" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          log(`Session error: ${loginErr.message}`, "error");
          return res.status(500).json({ message: "Erro ao criar sessão" });
        }
        log(`User logged in: id=${user.id}, email=${user.email}`, "auth");
        res.json({ user });
      });
    })(req, res, next);
  });

  // Logout
  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  // Get current user
  app.get(api.auth.me.path, requireAuth, (req, res) => {
    res.json(req.user);
  });

  // Update profile (course and year)
  app.put(api.auth.updateProfile.path, requireAuth, async (req, res) => {
    try {
      const input = api.auth.updateProfile.input.parse(req.body);
      const user = getCurrentUser(req);
      const updated = await storage.updateUserProfile(user.id, input.course || null, input.year || null);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Forgot password
  app.post(api.auth.forgotPassword.path, async (req, res) => {
    try {
      const { email } = api.auth.forgotPassword.input.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      // Always return success (security best practice)
      if (user) {
        const token = generateResetToken();
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // 1 hour expiry
        
        await storage.setResetPasswordToken(email, token, expires);
        
        // Send email (simplified - in production use proper email service)
        const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password?token=${token}`;
        
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Recuperação de Senha - Análise Matemática I",
            html: `
              <h2>Recuperação de Senha</h2>
              <p>Clique no link abaixo para redefinir sua senha:</p>
              <a href="${resetUrl}">${resetUrl}</a>
              <p>Este link expira em 1 hora.</p>
            `,
          });
        } else {
          log(`Reset password token for ${email}: ${token}`, "auth");
        }
      }
      
      res.json({ message: "Se o email existir, você receberá instruções para redefinir sua senha" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reset password
  app.post(api.auth.resetPassword.path, async (req, res) => {
    try {
      const input = api.auth.resetPassword.input.parse(req.body);
      const user = await storage.resetPassword(input.token, input.password);
      
      if (!user) {
        return res.status(400).json({ message: "Token inválido ou expirado" });
      }
      
      res.json({ message: "Senha redefinida com sucesso" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== PUBLIC ROUTES ==========
  
  // Public project statistics (accessible to everyone)
  app.get(api.public.projectStatistics.path, async (req, res) => {
    try {
      const stats = await storage.getProjectStatistics();
      res.json(stats);
    } catch (err) {
      log(`Error fetching project statistics: ${err instanceof Error ? err.message : 'Unknown error'}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== PROTECTED CALCULATION ROUTES ==========
  
  app.post(api.calculations.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.calculations.create.input.parse(req.body);
      const user = getCurrentUser(req);
      const calculation = await storage.createCalculation(user.id, input);
      log(`Calculation created: id=${calculation.id}, type=${calculation.type}, user=${user.id}`, "storage");
      res.status(201).json(calculation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        log(`Validation error: ${err.errors[0].message}`, "validation");
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      log(`Error creating calculation: ${err instanceof Error ? err.message : 'Unknown error'}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.calculations.list.path, requireAuth, async (req, res) => {
    try {
      const params = querySchema.parse(req.query);
      const user = getCurrentUser(req);
      const result = await storage.getCalculations(user.id, params);
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        log(`Query validation error: ${err.errors[0].message}`, "validation");
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      log(`Error fetching calculations: ${err instanceof Error ? err.message : 'Unknown error'}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.calculations.statistics.path, requireAuth, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      const stats = await storage.getStatistics(user.id);
      res.json(stats);
    } catch (err) {
      log(`Error fetching statistics: ${err instanceof Error ? err.message : 'Unknown error'}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.calculations.export.path, requireAuth, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      const params = querySchema.parse(req.query);
      const result = await storage.getCalculations(user.id, { ...params, limit: 10000 });
      
      // Generate CSV
      const headers = ['ID', 'Type', 'Function', 't1', 't2', 'Result', 'Created At'];
      const csvRows = [
        headers.join(','),
        ...result.data.map(c => [
          c.id,
          c.type,
          `"${c.functionExpression}"`,
          c.t1,
          c.t2,
          c.result,
          c.createdAt?.toISOString() || ''
        ].join(','))
      ];
      const csv = csvRows.join('\n');
      
      res.json({
        csv,
        json: result.data,
      });
    } catch (err) {
      log(`Error exporting calculations: ${err instanceof Error ? err.message : 'Unknown error'}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
