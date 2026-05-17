import { Router } from "express";
import { register, getMe, adminLogin } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/admin-login", adminLogin);
router.post("/register", verifyFirebaseToken, register);
router.get("/me", verifyFirebaseToken, getMe);

export default router;
