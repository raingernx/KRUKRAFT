-- CreateEnum
CREATE TYPE "CreatorApplicationStatus" AS ENUM ('NOT_APPLIED', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "appliedAt" TIMESTAMP(3),
ADD COLUMN     "creatorApplicationStatus" "CreatorApplicationStatus" NOT NULL DEFAULT 'NOT_APPLIED',
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3);
