import { Request, Response } from "express";
import {
  createFaq,
  deleteFaq,
  getFaqs,
  type FaqCreateData,
} from "../services/faq.service";

type CreateFaqBody = Pick<FaqCreateData, "question" | "answer" | "category">;

export async function listFaqs(_req: Request, res: Response) {
  const faqs = await getFaqs();

  return res.json(faqs);
}

export async function createFaqHandler(
  req: Request<unknown, unknown, CreateFaqBody>,
  res: Response,
) {
  const { question, answer, category } = req.body;

  const faq = await createFaq({ question, answer, category });

  return res.status(201).json(faq);
}

export async function deleteFaqHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  await deleteFaq(id);

  return res.status(204).send();
}
