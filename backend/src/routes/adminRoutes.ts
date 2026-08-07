import { Router } from "express";
import { getAdminSession, loginAdmin } from "../controllers/admin.controller";

const router = Router();

router.post("/admin/login", loginAdmin);
router.get("/admin/me", getAdminSession);

export default router;