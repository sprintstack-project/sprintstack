/*
  Warnings:

  - The `widgets` column on the `UserPreference` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `projectId` to the `UserPreference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPreference" ADD COLUMN     "projectId" UUID NOT NULL,
DROP COLUMN "widgets",
ADD COLUMN     "widgets" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
