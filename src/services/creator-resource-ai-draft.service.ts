import { z } from "zod";
import { logActivity } from "@/lib/activity";
import { slugify } from "@/lib/utils";
import {
  findCreatorResourceBySlug,
  findCreatorResourceById,
  updateCreatorResourceRecord,
} from "@/repositories/creators/creator.repository";
import { findResourceBySlug, createDraftResourceRecord, deleteStaleDraftResources } from "@/repositories/resources/resource.repository";
import {
  findResourceAIDraftByResourceId,
  updateResourceAIDraftRecord,
  upsertResourceAIDraftRecord,
} from "@/repositories/resources/resource-ai-draft.repository";
import {
  canAccessCreatorWorkspace,
  CreatorServiceError,
  getCreatorAccessState,
} from "@/services/creator.service";

const optionalTrimmedString = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().trim().max(max).optional());

const GenerateResourceAIDraftSchema = z.object({
  resourceId: z.string().cuid().optional(),
  sourceText: z
    .string()
    .trim()
    .min(120, "กรอกเนื้อหาอย่างน้อย 120 ตัวอักษร เพื่อให้ KruCraft สร้างฉบับร่างได้")
    .max(30_000, "เนื้อหาต้นฉบับต้องยาวไม่เกิน 30,000 ตัวอักษร"),
  sourceFileName: optionalTrimmedString(200).nullable(),
  subject: optionalTrimmedString(120).nullable(),
  grade: optionalTrimmedString(80).nullable(),
  language: z.string().trim().min(2).max(32).default("th"),
  quizCount: z.coerce.number().int().min(3).max(10).default(5),
  resourceSeed: z
    .object({
      title: optionalTrimmedString(200).nullable(),
      description: z
        .preprocess(
          (value) => (typeof value === "string" ? value.trim() : value),
          z.string().max(10_000).optional(),
        )
        .nullable(),
      slug: optionalTrimmedString(80).nullable(),
      type: z.enum(["PDF", "DOCUMENT"]).optional(),
      isFree: z.boolean().optional(),
      price: z.coerce.number().int().min(0).optional(),
      categoryId: z.string().cuid().nullable().optional(),
      fileUrl: optionalTrimmedString(2_000).nullable(),
      previewUrls: z.array(z.string().trim().min(1).max(2_000)).default([]),
    })
    .optional(),
});

const UpdateResourceAIDraftSchema = z.object({
  resourceId: z.string().cuid(),
  sourceText: z
    .string()
    .trim()
    .min(120, "กรอกเนื้อหาอย่างน้อย 120 ตัวอักษร เพื่อให้ KruCraft เก็บบริบทของฉบับร่างได้")
    .max(30_000, "เนื้อหาต้นฉบับต้องยาวไม่เกิน 30,000 ตัวอักษร"),
  sourceFileName: optionalTrimmedString(200).nullable(),
  subject: optionalTrimmedString(120).nullable(),
  grade: optionalTrimmedString(80).nullable(),
  language: z.string().trim().min(2).max(32),
  quizCount: z.coerce.number().int().min(3).max(10),
  summary: z
    .string()
    .trim()
    .min(20, "สรุปเนื้อหาต้องมีอย่างน้อย 20 ตัวอักษร")
    .max(8_000, "สรุปเนื้อหาต้องยาวไม่เกิน 8,000 ตัวอักษร"),
  learningOutcomes: z
    .string()
    .trim()
    .min(20, "ผลลัพธ์การเรียนรู้ต้องมีอย่างน้อย 20 ตัวอักษร")
    .max(8_000, "ผลลัพธ์การเรียนรู้ต้องยาวไม่เกิน 8,000 ตัวอักษร"),
  quizDraft: z
    .string()
    .trim()
    .min(20, "ชุดคำถามต้องมีอย่างน้อย 20 ตัวอักษร")
    .max(16_000, "ชุดคำถามต้องยาวไม่เกิน 16,000 ตัวอักษร"),
});

function prefersThai(language?: string | null) {
  return (language ?? "th").toLowerCase().startsWith("th");
}

function normalizeWhitespace(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function truncateAtSentenceBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const slice = value.slice(0, maxLength);
  const lastBoundary = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
    slice.lastIndexOf("\n"),
  );

  return (lastBoundary > 80 ? slice.slice(0, lastBoundary + 1) : slice).trim();
}

function splitIntoParagraphs(value: string) {
  return normalizeWhitespace(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function splitIntoSentences(value: string) {
  return normalizeWhitespace(value)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function extractTopicLabel(sourceText: string, subject?: string | null, language?: string | null) {
  if (subject?.trim()) {
    return subject.trim();
  }

  const firstParagraph =
    splitIntoParagraphs(sourceText)[0] ??
    (prefersThai(language) ? "สื่อการสอนนี้" : "this teaching resource");
  const firstLine = firstParagraph.split("\n")[0]?.trim() ?? firstParagraph;
  return truncateAtSentenceBoundary(firstLine, 80).replace(/[.:]+$/, "");
}

function createSummary(sourceText: string, topicLabel: string, language: string) {
  if (prefersThai(language)) {
    const paragraphs = splitIntoParagraphs(sourceText);

    if (paragraphs.length === 0) {
      return `สื่อการสอนนี้ช่วยให้ผู้เรียนทำความเข้าใจเรื่อง ${topicLabel} ผ่านคำอธิบาย ตัวอย่าง และแบบฝึกหัดที่นำไปใช้ต่อได้ทันที`;
    }

    return truncateAtSentenceBoundary(paragraphs.slice(0, 2).join(" "), 700);
  }

  const sentences = splitIntoSentences(sourceText);
  const selected = sentences.slice(0, 3);

  if (selected.length === 0) {
    return `This resource introduces ${topicLabel} and gives learners structured practice with the key ideas.`;
  }

  return truncateAtSentenceBoundary(selected.join(" "), 700);
}

function createLearningOutcomes(topicLabel: string, grade: string | null | undefined, language: string) {
  if (prefersThai(language)) {
    const audience = grade?.trim() ? `ในระดับ ${grade.trim()}` : "";

    return [
      `- อธิบายแนวคิดสำคัญและคำศัพท์พื้นฐานเกี่ยวกับ${topicLabel}${audience}ได้`,
      "- ใช้ตัวอย่าง ขั้นตอน หรือใบงานในสื่อนี้เพื่อทำกิจกรรมหรือแบบฝึกได้ด้วยตนเอง",
      "- สรุปสิ่งที่เรียนรู้และตรวจสอบความเข้าใจของตนเองจากคำถามท้ายกิจกรรมได้",
    ].join("\n");
  }

  const audience = grade?.trim() ? ` for ${grade.trim()} learners` : "";

  return [
    `- Explain the main ideas and vocabulary related to ${topicLabel}${audience}.`,
    `- Use the examples, steps, or reference material in this resource to complete independent practice.`,
    `- Check understanding by discussing or writing about what was learned from the resource.`,
  ].join("\n");
}

function createQuizDraft(
  sourceText: string,
  summary: string,
  topicLabel: string,
  quizCount: number,
  language: string,
) {
  const sentences = splitIntoSentences(sourceText).filter((sentence) => sentence.length >= 40);
  const prompts = sentences.length > 0 ? sentences : splitIntoParagraphs(sourceText);
  const normalizedPrompts = prompts.length > 0 ? prompts : [summary];

  return Array.from({ length: quizCount }, (_, index) => {
    const prompt = normalizedPrompts[index % normalizedPrompts.length] ?? summary;
    const condensedPrompt = truncateAtSentenceBoundary(prompt, 180);

    if (prefersThai(language)) {
      return [
        `${index + 1}. คำถามสั้น`,
        `คำถาม: จากเนื้อหาเรื่อง${topicLabel} ให้อธิบายหรือยกตัวอย่างจากประเด็นนี้: ${condensedPrompt}`,
        `แนวคำตอบ: ${condensedPrompt}`,
      ].join("\n");
    }

    return [
      `${index + 1}. Short answer`,
      `Question: Based on the resource, explain this idea about ${topicLabel}: ${condensedPrompt}`,
      `Answer guide: ${condensedPrompt}`,
    ].join("\n");
  }).join("\n\n");
}

function buildHeuristicDraft(input: z.infer<typeof GenerateResourceAIDraftSchema>) {
  const sourceText = normalizeWhitespace(input.sourceText);
  const topicLabel = extractTopicLabel(sourceText, input.subject, input.language);
  const summary = createSummary(sourceText, topicLabel, input.language);

  return {
    sourceText,
    sourceFileName: input.sourceFileName ?? null,
    subject: input.subject ?? null,
    grade: input.grade ?? null,
    language: input.language,
    quizCount: input.quizCount,
    summary,
    learningOutcomes: createLearningOutcomes(topicLabel, input.grade, input.language),
    quizDraft: createQuizDraft(sourceText, summary, topicLabel, input.quizCount, input.language),
    generationMode: "HEURISTIC_V1",
  };
}

function normalizeResourceSeed(
  seed: z.infer<typeof GenerateResourceAIDraftSchema>["resourceSeed"],
) {
  if (!seed) {
    return null;
  }

  return {
    title: seed.title ?? null,
    description: seed.description ?? null,
    slug: seed.slug ?? null,
    type: seed.type ?? "PDF",
    isFree: seed.isFree ?? true,
    price: seed.isFree === false ? seed.price ?? 0 : 0,
    categoryId: seed.categoryId ?? null,
    fileUrl: seed.fileUrl ?? null,
    previewUrls: seed.previewUrls.map((url) => url.trim()).filter(Boolean),
  };
}

async function generateUniqueDraftSlug(base: string, userId: string, excludeId?: string) {
  const baseSlug = slugify(base).slice(0, 72) || "resource-draft";
  let candidate = baseSlug;
  let attempt = 0;

  while (true) {
    const [creatorOwned, existing] = await Promise.all([
      findCreatorResourceBySlug(userId, candidate),
      findResourceBySlug(candidate),
    ]);

    const creatorOwnedId = creatorOwned?.id;
    const existingId = existing?.id;

    if (
      (!creatorOwnedId || creatorOwnedId === excludeId) &&
      (!existingId || existingId === excludeId)
    ) {
      return candidate;
    }

    attempt += 1;
    candidate = `${baseSlug}-${attempt}`;
  }
}

async function requireCreatorWorkspaceAccess(userId: string) {
  const access = await getCreatorAccessState(userId);

  if (!canAccessCreatorWorkspace(access)) {
    throw new CreatorServiceError(403, {
      error: "บัญชีนี้ยังไม่ได้เปิดใช้งานพื้นที่ครีเอเตอร์",
    });
  }

  return access;
}

async function ensureOwnedResource(userId: string, resourceId: string) {
  const resource = await findCreatorResourceById(userId, resourceId);

  if (!resource) {
    throw new CreatorServiceError(404, {
      error: "ไม่พบ resource นี้",
    });
  }

  return resource;
}

export async function generateCreatorResourceAIDraft(userId: string, input: unknown) {
  const access = await requireCreatorWorkspaceAccess(userId);
  const parsed = GenerateResourceAIDraftSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new CreatorServiceError(400, {
      error: issue?.message ?? "ข้อมูลที่ส่งมาสำหรับสร้าง AI draft ไม่ถูกต้อง",
      fields: issue?.path[0] ? { [String(issue.path[0])]: issue.message } : undefined,
    });
  }

  let resourceId = parsed.data.resourceId;
  let createdDraftResource = false;

  if (resourceId) {
    await ensureOwnedResource(userId, resourceId);
  } else {
    if (!access.canCreate) {
      throw new CreatorServiceError(403, {
        error: "บัญชีนี้เข้าถึงพื้นที่ครีเอเตอร์ได้ แต่ยังไม่มีสิทธิ์สร้าง resource ใหม่",
      });
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await deleteStaleDraftResources(cutoff);

    const draftTitle = "AI resource draft";
    const resourceSeed = normalizeResourceSeed(parsed.data.resourceSeed);
    const seedTitle = resourceSeed?.title || draftTitle;
    const slug = await generateUniqueDraftSlug(resourceSeed?.slug || seedTitle, userId);
    const draftResource = await createDraftResourceRecord({
      title: draftTitle,
      slug,
      authorId: userId,
    });

    resourceId = draftResource.id;
    createdDraftResource = true;

    if (resourceSeed) {
      await updateCreatorResourceRecord(userId, resourceId, {
        title: resourceSeed.title ?? draftTitle,
        slug,
        description: resourceSeed.description ?? "",
        type: resourceSeed.type,
        isFree: resourceSeed.isFree,
        price: resourceSeed.isFree ? 0 : resourceSeed.price,
        categoryId: resourceSeed.categoryId,
        fileUrl: resourceSeed.fileUrl,
        previewUrl: resourceSeed.previewUrls[0] ?? null,
        previewUrls: resourceSeed.previewUrls,
      });
    }
  }

  const draftPayload = buildHeuristicDraft(parsed.data);
  const draft = await upsertResourceAIDraftRecord({
    resourceId,
    ...draftPayload,
  });

  void logActivity({
    userId,
    action: "creator_ai_draft_generated",
    entity: "resource",
    entityId: resourceId,
    metadata: {
      quizCount: draft.quizCount,
      generationMode: draft.generationMode,
      createdDraftResource,
    },
  });

  return {
    resourceId,
    createdDraftResource,
    draft,
  };
}

export async function updateCreatorResourceAIDraft(userId: string, input: unknown) {
  await requireCreatorWorkspaceAccess(userId);

  const parsed = UpdateResourceAIDraftSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new CreatorServiceError(400, {
      error: issue?.message ?? "ข้อมูลที่ส่งมาสำหรับบันทึก AI draft ไม่ถูกต้อง",
      fields: issue?.path[0] ? { [String(issue.path[0])]: issue.message } : undefined,
    });
  }

  await ensureOwnedResource(userId, parsed.data.resourceId);

  const existing = await findResourceAIDraftByResourceId(parsed.data.resourceId);
  if (!existing) {
    throw new CreatorServiceError(404, {
      error: "ยังไม่พบ AI draft สำหรับ resource นี้",
    });
  }

  const draft = await updateResourceAIDraftRecord(parsed.data.resourceId, {
    sourceText: normalizeWhitespace(parsed.data.sourceText),
    sourceFileName: parsed.data.sourceFileName ?? null,
    subject: parsed.data.subject ?? null,
    grade: parsed.data.grade ?? null,
    language: parsed.data.language,
    quizCount: parsed.data.quizCount,
    summary: parsed.data.summary.trim(),
    learningOutcomes: parsed.data.learningOutcomes.trim(),
    quizDraft: parsed.data.quizDraft.trim(),
  });

  void logActivity({
    userId,
    action: "creator_ai_draft_saved",
    entity: "resource",
    entityId: parsed.data.resourceId,
    metadata: {
      quizCount: draft.quizCount,
      generationMode: existing.generationMode,
    },
  });

  return {
    resourceId: parsed.data.resourceId,
    draft,
  };
}
