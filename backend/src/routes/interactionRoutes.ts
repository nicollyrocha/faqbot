import { Router } from "express";
import {
	createInteraction,
	getInteractionTimeline,
	getInteractions,
} from "../controllers/interactions.controller";

const router = Router();

router.get("/interactions", getInteractions);
router.get("/interactions/timeline", getInteractionTimeline);
router.post("/interaction", createInteraction);

export default router;
