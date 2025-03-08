-- CreateTable
CREATE TABLE "StudyProgress" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "goodCount" INTEGER NOT NULL DEFAULT 0,
    "normalCount" INTEGER NOT NULL DEFAULT 0,
    "badCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgress_date_key" ON "StudyProgress"("date");
