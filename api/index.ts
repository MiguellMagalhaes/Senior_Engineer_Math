import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";
import { setupAuth } from "../server/auth";

// Create Express app
const app = express();

// Setup authentication
setupAuth(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (res.headersSent) {
    return _next(err);
  }
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Initialize routes (only once)
let appInitialized = false;

async function initializeApp() {
  if (appInitialized) return;
  
  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);
  appInitialized = true;
}

// Vercel serverless function handler
// This only handles /api/* routes (configured in vercel.json)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initializeApp();
  
  // Convert Vercel request/response to Express-compatible format
  return new Promise<void>((resolve) => {
    app(req as any, res as any, () => {
      resolve();
    });
  });
}
