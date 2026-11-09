-- AlterTable
ALTER TABLE "invitation" ADD COLUMN "projectId" UUID;

-- CreateIndex
CREATE INDEX "invitation_projectId_idx" ON "invitation"("projectId");

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
