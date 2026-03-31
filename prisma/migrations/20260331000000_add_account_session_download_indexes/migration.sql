-- Add missing indexes on Account.userId, Session.userId, and DownloadEvent.userId
-- These are used by NextAuth PrismaAdapter on every authentication and by analytics queries.

CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "DownloadEvent_userId_idx" ON "DownloadEvent"("userId");
