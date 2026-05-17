import { Request, Response } from "express";
import * as maintenanceService from "../services/maintenanceService";

// GET /api/maintenance
export const getAllItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await maintenanceService.findAll();
    const stats = await maintenanceService.getTotalFundStats();
    res.json({ success: true, data: items, stats });
  } catch (error) {
    console.error("[maintenanceController.getAllItems]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/maintenance/:id
export const getItemById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const item = await maintenanceService.findById(id);

    if (!item) {
      res
        .status(404)
        .json({ success: false, message: "Maintenance item not found" });
      return;
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error("[maintenanceController.getItemById]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/maintenance  (admin only)
// Body: { itemName: string, requiredFunds: number }
export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { itemName, requiredFunds } = req.body;

    if (!itemName || !requiredFunds) {
      res.status(400).json({
        success: false,
        message: "itemName and requiredFunds are required",
      });
      return;
    }

    const item = await maintenanceService.createItem({
      itemName,
      requiredFunds: parseInt(requiredFunds),
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error("[maintenanceController.createItem]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PATCH /api/maintenance/:id/funds
// Body: { amount: number } — adds to existing collectedFunds
export const addFunds = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { amount } = req.body;

    if (!amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
      res.status(400).json({
        success: false,
        message: "amount must be a positive number",
      });
      return;
    }

    const item = await maintenanceService.addFunds(id, parseInt(amount));
    res.json({ success: true, data: item });
  } catch (error: any) {
    if (error.message === "Maintenance item not found") {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    console.error("[maintenanceController.addFunds]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/maintenance/:id  (admin only)
export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    await maintenanceService.deleteItem(id);
    res.json({ success: true, message: "Maintenance item deleted" });
  } catch (error) {
    console.error("[maintenanceController.deleteItem]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
