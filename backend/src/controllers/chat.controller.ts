import { Request, Response } from "express";
import { findFaq } from "../services/chat.service";
import { createInteraction } from "../services/interaction.service";

export async function chat(req: Request, res: Response) {
  console.log('entrou')
  const { sessionId, question } = req.body;

  if (typeof sessionId !== "string" || !sessionId.trim()) {
    return res.status(400).json({ message: "sessionId é obrigatório" });
  }

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ message: "question é obrigatória" });
  }

  console.log('question', question);

  const faq = await findFaq(question);
  console.log('faq', faq);
  const answer = faq?.answer ?? "Não encontrei uma resposta.";
  console.log('answer', answer);

  const interactionData = {
    sessionId,
    question,
    response: answer,
    foundAnswer: Boolean(faq),
    ...(faq?.id !== undefined ? { matchedFaqId: faq.id } : {}),
  };

  await createInteraction(interactionData);

  return res.json({
    answer,
    foundAnswer: Boolean(faq),
    matchedFaqId: faq?.id ?? null,
  });
}
