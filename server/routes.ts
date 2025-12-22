import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { querySchema } from "@shared/schema";
import { z } from "zod";
import { log } from "./index";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.calculations.create.path, async (req, res) => {
    try {
      const input = api.calculations.create.input.parse(req.body);
      const calculation = await storage.createCalculation(input);
      log(`Calculation created: id=${calculation.id}, type=${calculation.type}`, "storage");
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

  app.get(api.calculations.list.path, async (req, res) => {
    try {
      const params = querySchema.parse(req.query);
      const result = await storage.getCalculations(params);
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

  app.get(api.calculations.statistics.path, async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (err) {
      log(`Error fetching statistics: ${err instanceof Error ? err.message : 'Unknown error'}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.calculations.export.path, async (req, res) => {
    try {
      const all = await storage.getAllCalculations();
      
      // Generate CSV
      const headers = ['ID', 'Type', 'Function', 't1', 't2', 'Result', 'Created At'];
      const csvRows = [
        headers.join(','),
        ...all.map(c => [
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
        json: all,
      });
    } catch (err) {
      log(`Error exporting calculations: ${err instanceof Error ? err.message : 'Unknown error'}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
