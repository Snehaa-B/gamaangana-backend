import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import hallRoutes from "./routes/hallRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import eventRoutes from "./routes/eventRoutes";
import maintenanceRoutes from "./routes/maintenanceRoutes";

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Grama Angana API Running" });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[GlobalError]", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;