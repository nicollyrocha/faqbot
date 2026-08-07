import { Router } from "express";
import { createFaqHandler, deleteFaqHandler, listFaqs } from "../controllers/faq.controller";

const router = Router();

router.get("/faq", listFaqs);
router.post("/faq", createFaqHandler);
router.delete("/faq/:id", deleteFaqHandler);

export default router;
