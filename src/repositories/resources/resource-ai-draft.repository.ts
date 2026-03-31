import { prisma } from "@/lib/prisma";

export interface UpsertResourceAIDraftRecordInput {
  resourceId: string;
  sourceText: string;
  sourceFileName?: string | null;
  subject?: string | null;
  grade?: string | null;
  language: string;
  quizCount: number;
  summary: string;
  learningOutcomes: string;
  quizDraft: string;
  generationMode: string;
}

export interface UpdateResourceAIDraftRecordInput {
  sourceText?: string;
  sourceFileName?: string | null;
  subject?: string | null;
  grade?: string | null;
  language?: string;
  quizCount?: number;
  summary?: string;
  learningOutcomes?: string;
  quizDraft?: string;
}

const RESOURCE_AI_DRAFT_SELECT = {
  id: true,
  resourceId: true,
  sourceText: true,
  sourceFileName: true,
  subject: true,
  grade: true,
  language: true,
  quizCount: true,
  summary: true,
  learningOutcomes: true,
  quizDraft: true,
  generationMode: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function findResourceAIDraftByResourceId(resourceId: string) {
  return prisma.resourceAIDraft.findUnique({
    where: { resourceId },
    select: RESOURCE_AI_DRAFT_SELECT,
  });
}

export async function upsertResourceAIDraftRecord(
  input: UpsertResourceAIDraftRecordInput,
) {
  return prisma.resourceAIDraft.upsert({
    where: { resourceId: input.resourceId },
    create: {
      resourceId: input.resourceId,
      sourceText: input.sourceText,
      sourceFileName: input.sourceFileName ?? null,
      subject: input.subject ?? null,
      grade: input.grade ?? null,
      language: input.language,
      quizCount: input.quizCount,
      summary: input.summary,
      learningOutcomes: input.learningOutcomes,
      quizDraft: input.quizDraft,
      generationMode: input.generationMode,
    },
    update: {
      sourceText: input.sourceText,
      sourceFileName: input.sourceFileName ?? null,
      subject: input.subject ?? null,
      grade: input.grade ?? null,
      language: input.language,
      quizCount: input.quizCount,
      summary: input.summary,
      learningOutcomes: input.learningOutcomes,
      quizDraft: input.quizDraft,
      generationMode: input.generationMode,
    },
    select: RESOURCE_AI_DRAFT_SELECT,
  });
}

export async function updateResourceAIDraftRecord(
  resourceId: string,
  input: UpdateResourceAIDraftRecordInput,
) {
  return prisma.resourceAIDraft.update({
    where: { resourceId },
    data: {
      ...(input.sourceText !== undefined ? { sourceText: input.sourceText } : {}),
      ...(input.sourceFileName !== undefined
        ? { sourceFileName: input.sourceFileName }
        : {}),
      ...(input.subject !== undefined ? { subject: input.subject } : {}),
      ...(input.grade !== undefined ? { grade: input.grade } : {}),
      ...(input.language !== undefined ? { language: input.language } : {}),
      ...(input.quizCount !== undefined ? { quizCount: input.quizCount } : {}),
      ...(input.summary !== undefined ? { summary: input.summary } : {}),
      ...(input.learningOutcomes !== undefined
        ? { learningOutcomes: input.learningOutcomes }
        : {}),
      ...(input.quizDraft !== undefined ? { quizDraft: input.quizDraft } : {}),
    },
    select: RESOURCE_AI_DRAFT_SELECT,
  });
}
