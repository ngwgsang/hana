/*
  Warnings:

  - You are about to drop the column `scheduleId` on the `AnkiCard` table. All the data in the column will be lost.
  - You are about to drop the `AnkiSch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnkiCard" DROP CONSTRAINT "AnkiCard_scheduleId_fkey";

-- DropIndex
DROP INDEX "AnkiCard_scheduleId_key";

-- AlterTable
ALTER TABLE "AnkiCard" DROP COLUMN "scheduleId",
ADD COLUMN     "enrollAt" TIMESTAMP(3),
ADD COLUMN     "point" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "AnkiSch";
