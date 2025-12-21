import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.calculations.create.path, async (req, res) => {
    try {
      const input = api.calculations.create.input.parse(req.body);
      const calculation = await storage.createCalculation(input);
      res.status(201).json(calculation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.calculations.list.path, async (req, res) => {
    const list = await storage.getCalculations();
    res.json(list);
  });

  return httpServer;
}
