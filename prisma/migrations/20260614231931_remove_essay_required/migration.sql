/*
  Warnings:

  - You are about to drop the column `essayRequired` on the `Scholarship` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scholarship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "amount" TEXT,
    "deadline" TEXT,
    "description" TEXT,
    "eligibility" TEXT,
    "url" TEXT,
    "sourceUrl" TEXT,
    "source" TEXT,
    "tags" TEXT,
    "amountValue" INTEGER,
    "level" TEXT,
    "deadlineDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME
);
INSERT INTO "new_Scholarship" ("amount", "amountValue", "deadline", "deadlineDate", "description", "eligibility", "id", "level", "name", "organization", "reviewedAt", "scrapedAt", "source", "sourceUrl", "status", "tags", "url") SELECT "amount", "amountValue", "deadline", "deadlineDate", "description", "eligibility", "id", "level", "name", "organization", "reviewedAt", "scrapedAt", "source", "sourceUrl", "status", "tags", "url" FROM "Scholarship";
DROP TABLE "Scholarship";
ALTER TABLE "new_Scholarship" RENAME TO "Scholarship";
CREATE INDEX "Scholarship_status_idx" ON "Scholarship"("status");
CREATE UNIQUE INDEX "Scholarship_name_url_key" ON "Scholarship"("name", "url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
