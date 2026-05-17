import { Request, Response } from "express";
import * as eventService from "../services/eventService";

// GET /api/events
export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await eventService.findAll();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error("[eventController.getAllEvents]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/events/upcoming
// Returns only events with a future date — used for calendar view.
export const getUpcomingEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await eventService.findUpcoming();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error("[eventController.getUpcomingEvents]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/events/:id
export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const event = await eventService.findById(id);

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error("[eventController.getEventById]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
