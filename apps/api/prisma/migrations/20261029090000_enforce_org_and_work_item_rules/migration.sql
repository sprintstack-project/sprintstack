-- DropIndex
DROP INDEX "member_organizationId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "member_organizationId_userId_key" ON "member"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "sprint_one_active_per_project" ON "sprint"("projectId") WHERE (state = 'active');


-- Fractional-index ranks compare byte by byte. Prisma can't express a column collation, and
-- doesn't diff it, so this stays as written.
ALTER TABLE "workItem" ALTER COLUMN "rank" TYPE TEXT COLLATE "C";

-- A related link has no direction: store it once, with the smaller id as fromId. Prisma doesn't
-- manage check constraints, so this stays as written.
ALTER TABLE "workItemLink" ADD CONSTRAINT "workItemLink_related_ordered"
    CHECK ("kind" <> 'related' OR "fromId" < "toId");
