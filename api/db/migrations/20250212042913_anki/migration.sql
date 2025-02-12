-- CreateTable
CREATE TABLE "AnkiCard" (
    "id" SERIAL NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "scheduleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnkiCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnkiTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AnkiTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnkiSch" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrollAt" TIMESTAMP(3),
    "point" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AnkiSch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnkiCardToAnkiTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AnkiCard_scheduleId_key" ON "AnkiCard"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "AnkiTag_name_key" ON "AnkiTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AnkiCardToAnkiTag_AB_unique" ON "_AnkiCardToAnkiTag"("A", "B");

-- CreateIndex
CREATE INDEX "_AnkiCardToAnkiTag_B_index" ON "_AnkiCardToAnkiTag"("B");

-- AddForeignKey
ALTER TABLE "AnkiCard" ADD CONSTRAINT "AnkiCard_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "AnkiSch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnkiCardToAnkiTag" ADD CONSTRAINT "_AnkiCardToAnkiTag_A_fkey" FOREIGN KEY ("A") REFERENCES "AnkiCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnkiCardToAnkiTag" ADD CONSTRAINT "_AnkiCardToAnkiTag_B_fkey" FOREIGN KEY ("B") REFERENCES "AnkiTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
