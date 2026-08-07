import Fuse from "fuse.js";
import { prisma } from "../lib/prisma";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function findFaq(userQuestion: string) {
  const faqs = await prisma.faq.findMany();

  const normalizedQuestion = normalizeText(userQuestion);
  const normalizedFaqs = faqs.map((faq) => ({
    ...faq,
    question: normalizeText(faq.question),
  }));


  const fuse = new Fuse(normalizedFaqs, {
    keys: ["question"],
    threshold: 0.5,
    ignoreLocation: true,
  });

  const result = fuse.search(normalizedQuestion);

  if (!result.length) {
    return null;
  }

  return result[0]?.item;
}