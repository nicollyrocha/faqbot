import { prisma } from "../lib/prisma";

export type FaqRecord = Awaited<ReturnType<typeof prisma.faq.findMany>>[number];
export type FaqCreateData = Parameters<typeof prisma.faq.create>[0]["data"];

export async function getFaqs(): Promise<FaqRecord[]> {
  return prisma.faq.findMany();
}

export async function createFaq(data: FaqCreateData): Promise<FaqRecord> {
  const faq = await prisma.faq.create({
    data,
  });

  return faq;
}

export async function deleteFaq(id: number): Promise<FaqRecord> {
  return prisma.faq.delete({
    where: { id },
  });
}