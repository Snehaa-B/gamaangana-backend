import { Router } from "express";
import {
  getAllHalls,
  getHallById,
  getHallAvailability,
  getAdminStats,
  createHall,
  updateHall,
  deleteHall,
} from "../controllers/hallController";
import {
  verifyFirebaseToken,
  requireAdmin,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllHalls);
router.get("/admin/stats", verifyFirebaseToken, requireAdmin, getAdminStats);
router.get("/:id/availability", getHallAvailability);
router.get("/:id", getHallById);

router.post("/", verifyFirebaseToken, requireAdmin, createHall);
router.patch("/:id", verifyFirebaseToken, requireAdmin, updateHall);
router.delete("/:id", verifyFirebaseToken, requireAdmin, deleteHall);

export default router;
