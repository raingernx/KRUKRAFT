-- Store private AI-generated resource drafts for creator workflows.

CREATE TABLE IF NOT EXISTS "ResourceAIDraft" (
  "id" TEXT NOT NULL,
  "resourceId" TEXT NOT NULL,
  "sourceText" TEXT NOT NULL,
  "sourceFileName" TEXT,
  "subject" TEXT,
  "grade" TEXT,
  "language" TEXT NOT NULL DEFAULT 'th',
  "quizCount" INTEGER NOT NULL DEFAULT 5,
  "summary" TEXT NOT NULL,
  "learningOutcomes" TEXT NOT NULL,
  "quizDraft" TEXT NOT NULL,
  "generationMode" TEXT NOT NULL DEFAULT 'HEURISTIC_V1',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ResourceAIDraft_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ResourceAIDraft_resourceId_fkey"
    FOREIGN KEY ("resourceId") REFERENCES "Resource"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ResourceAIDraft_resourceId_key"
  ON "ResourceAIDraft"("resourceId");

CREATE INDEX IF NOT EXISTS "ResourceAIDraft_updatedAt_idx"
  ON "ResourceAIDraft"("updatedAt");
