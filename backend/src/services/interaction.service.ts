import { prisma } from "../lib/prisma";

export type InteractionRecord = Awaited<
  ReturnType<typeof prisma.interaction.findMany>
>[number];
export type InteractionCreateData = Parameters<
  typeof prisma.interaction.create
>[0]["data"];

export async function createInteraction(
  data: InteractionCreateData,
): Promise<InteractionRecord> {

  return prisma.interaction.create({
    data,
  });
}

export async function getInteractionsBySession(
  sessionId: string,
): Promise<InteractionRecord[]> {
  return prisma.interaction.findMany({
    where: {
      sessionId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getAllInteractions(): Promise<InteractionRecord[]> {
  return prisma.interaction.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}

export type InteractionTimelinePoint = {
  date: string;
  label: string;
  total: number;
};

export async function getInteractionTimeline(
  days = 30,
): Promise<InteractionTimelinePoint[]> {
  const interactions = await prisma.interaction.findMany({
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const counts = interactions.reduce<Record<string, number>>(
    (accumulator, interaction) => {
      const createdAt = new Date(interaction.createdAt);

      if (Number.isNaN(createdAt.getTime()) || createdAt < startDate) {
        return accumulator;
      }

      const key = getDateKey(createdAt);
      accumulator[key] = (accumulator[key] ?? 0) + 1;

      return accumulator;
    },
    {},
  );

  return Array.from({ length: days }, (_, index) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + index);

    const dateKey = getDateKey(currentDate);

    return {
      date: dateKey,
      label: formatter.format(currentDate),
      total: counts[dateKey] ?? 0,
    };
  });
}