-- CreateTable
CREATE TABLE "projectSettings" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "sprintDuration" INTEGER DEFAULT 14,
    "sprintStartsOn" INTEGER DEFAULT 1,
    "startSprintAutomatically" BOOLEAN NOT NULL DEFAULT true,
    "carryOverIncompleteWork" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projectSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projectSettings_projectId_key" ON "projectSettings"("projectId");

-- AddForeignKey
ALTER TABLE "projectSettings" ADD CONSTRAINT "projectSettings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
