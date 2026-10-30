-- DropIndex
DROP INDEX "restoreKey_sessionId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "restoreKey_sessionId_key" ON "restoreKey"("sessionId");

