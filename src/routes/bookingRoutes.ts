import { Router } from "express";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
} from "../controllers/bookingController";
import {
  verifyFirebaseToken,
  requireAdmin,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", verifyFirebaseToken, getAllBookings);
router.get("/:id", verifyFirebaseToken, getBookingById);
router.post("/", verifyFirebaseToken, createBooking);
router.patch(
  "/:id/status",
  verifyFirebaseToken,
  requireAdmin,
  updateBookingStatus
);

export default router;
