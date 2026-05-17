import { Request, Response } from "express";
import * as userService from "../services/userService";
import { AuthRequest } from "../types";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@gamaangana.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123";
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN ?? "gamaangana-admin-dev-token";

export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const firebaseUser = req.user!;
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({ success: false, message: "Name is required" });
      return;
    }

    if (!firebaseUser.email) {
      res
        .status(400)
        .json({ success: false, message: "Firebase account has no email" });
      return;
    }

    const user = await userService.registerOrFetch({
      name: name.trim(),
      email: firebaseUser.email,
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("[authController.register]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.isAdmin) {
      res.json({
        success: true,
        data: {
          id: 0,
          name: "Community Admin",
          email: req.adminEmail ?? ADMIN_EMAIL,
          role: "ADMIN",
        },
      });
      return;
    }

    const firebaseUser = req.user!;

    if (!firebaseUser.email) {
      res.status(400).json({ success: false, message: "No email in token" });
      return;
    }

    const user = await userService.findByEmail(firebaseUser.email);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("[authController.getMe]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      res.status(401).json({ success: false, message: "Invalid admin credentials" });
      return;
    }

    res.json({
      success: true,
      data: {
        token: ADMIN_TOKEN,
        role: "ADMIN",
        name: "Community Admin",
        email: ADMIN_EMAIL,
      },
    });
  } catch (error) {
    console.error("[authController.adminLogin]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
