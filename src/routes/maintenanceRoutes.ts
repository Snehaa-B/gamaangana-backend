import { Router } from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  addFunds,
  deleteItem,
} from "../controllers/maintenanceController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();

// Public routes — maintenance progress is visible to the community
router.get("/", getAllItems);
router.get("/:id", getItemById);

// Protected routes
router.post("/", verifyFirebaseToken, createItem);
router.patch("/:id/funds", verifyFirebaseToken, addFunds);
router.delete("/:id", verifyFirebaseToken, deleteItem);

export default router;
