import { Router } from "express";
import {
  getAllEvents,
  getUpcomingEvents,
  getEventById,
} from "../controllers/eventController";

const router = Router();

// Events are public — the community calendar is visible to everyone
router.get("/", getAllEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/:id", getEventById);

export default router;
