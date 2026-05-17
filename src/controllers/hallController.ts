import { Request, Response } from "express";
import * as hallService from "../services/hallService";
import { DEFAULT_TIME_SLOTS } from "../types";

export const getAllHalls = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const halls = await hallService.findAll();
    res.json({ success: true, data: halls });
  } catch (error) {
    console.error("[hallController.getAllHalls]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getHallById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid hall ID" });
      return;
    }

    const hall = await hallService.findById(id);
    if (!hall) {
      res.status(404).json({ success: false, message: "Hall not found" });
      return;
    }

    res.json({ success: true, data: hall });
  } catch (error) {
    console.error("[hallController.getHallById]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/** UI time slots — one booking per hall per day in DB; day booked = all slots BOOKED */
export const getHallAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const date = req.query.date as string;

    if (isNaN(id) || !date) {
      res.status(400).json({
        success: false,
        message: "hall id and date query (YYYY-MM-DD) are required",
      });
      return;
    }

    const bookings = await hallService.findBookingsOnDate(id, date);
    const dayBooked = bookings.length > 0;

    const slots = DEFAULT_TIME_SLOTS.map((slot) => ({
      ...slot,
      status: dayBooked ? "BOOKED" : "FREE",
    }));

    res.json({ success: true, data: { date, slots, bookings } });
  } catch (error) {
    console.error("[hallController.getHallAvailability]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAdminStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await hallService.getAdminStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("[hallController.getAdminStats]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createHall = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, location, capacity } = req.body;

    if (!name || !location || capacity == null) {
      res.status(400).json({
        success: false,
        message: "name, location, and capacity are required",
      });
      return;
    }

    const hall = await hallService.createHall({
      name,
      location,
      capacity: parseInt(capacity),
    });

    res.status(201).json({ success: true, data: hall });
  } catch (error) {
    console.error("[hallController.createHall]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateHall = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, location, capacity } = req.body;

    const hall = await hallService.updateHall(id, {
      ...(name && { name }),
      ...(location && { location }),
      ...(capacity != null && { capacity: parseInt(capacity) }),
    });

    res.json({ success: true, data: hall });
  } catch (error) {
    console.error("[hallController.updateHall]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteHall = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    await hallService.deleteHall(id);
    res.json({ success: true, message: "Hall deleted" });
  } catch (error) {
    console.error("[hallController.deleteHall]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
