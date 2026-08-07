import { Request, Response } from "express";
import interactionService = require("../services/interaction.service");
import type { InteractionCreateData } from "../services/interaction.service";

type CreateInteractionBody = {
  sessionId: string;
  question: string;
  response?: string | null;
  matchedFaqId?: number | null;
  foundAnswer: boolean;
};

export async function getInteractions(req: Request, res: Response) {
  const sessionId = req.query.sessionId ?? req.body?.sessionId;

  if (typeof sessionId === "string" && sessionId) {
    const response = await interactionService.getInteractionsBySession(sessionId);

    return res.json(response);
  }

  const response = await interactionService.getAllInteractions();

  return res.json(response);
}

export async function getInteractionTimeline(req: Request, res: Response) {
  const daysParam = Number(req.query.days ?? 30);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : 30;

  const response = await interactionService.getInteractionTimeline(days);

  return res.json(response);
}


export async function createInteraction(
  req: Request<unknown, unknown, CreateInteractionBody>,
  res: Response,
) {
  const { sessionId, question, response, matchedFaqId, foundAnswer } = req.body;

  const interactionData: InteractionCreateData = {
    sessionId,
    question,
    foundAnswer,
    ...(response !== undefined && response !== null ? { response } : {}),
    ...(matchedFaqId !== undefined && matchedFaqId !== null
      ? { matchedFaqId }
      : {}),
  };

  const interaction = await interactionService.createInteraction(interactionData);

  return res.status(201).json(interaction);
}