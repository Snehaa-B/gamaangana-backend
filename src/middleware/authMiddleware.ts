import { Response, NextFunction } from "express";
import admin from "../config/firebase";
import { AuthRequest } from "../types";

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN ?? "gamaangana-admin-dev-token";

export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (token === ADMIN_TOKEN) {
    req.isAdmin = true;
    req.adminEmail = process.env.ADMIN_EMAIL ?? "admin@gamaangana.com";
    next();
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export const verifyAuth = verifyFirebaseToken;

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAdmin) {
    next();
    return;
  }
  res.status(403).json({ success: false, message: "Admin access required" });
};
