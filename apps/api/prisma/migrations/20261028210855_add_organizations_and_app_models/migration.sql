-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('admin', 'member', 'viewer');

-- CreateEnum
CREATE TYPE "Methodology" AS ENUM ('scrum', 'kanban');

-- CreateEnum
CREATE TYPE "SprintState" AS ENUM ('planned', 'active', 'closed');

-- CreateEnum
CREATE TYPE "WorkItemType" AS ENUM ('epic', 'feature', 'story', 'bug', 'task');

-- CreateEnum
CREATE TYPE "WorkItemStatus" AS ENUM ('todo', 'in_progress', 'in_review', 'blocked', 'done');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('highest', 'high', 'medium', 'low', 'lowest');

-- CreateEnum
CREATE TYPE "WorkItemLinkKind" AS ENUM ('related', 'precedes', 'causes');

-- CreateEnum
CREATE TYPE "TimeOffType" AS ENUM ('vacation', 'sick', 'half', 'other');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('created', 'updated', 'status_changed', 'assigned', 'sprint_changed', 'commented', 'linked', 'attached', 'deleted');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('assigned', 'mentioned', 'commented', 'status_changed', 'sprint_starting', 'sprint_ending');

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "activeOrganizationId" TEXT;

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "metadata" TEXT,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviterId" TEXT NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL,
    "organizationId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "methodology" "Methodology" NOT NULL DEFAULT 'scrum',
    "nextItemNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectMember" (
    "projectId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'member',
    "title" TEXT,
    "estimates" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projectMember_pkey" PRIMARY KEY ("projectId","userId")
);

-- CreateTable
CREATE TABLE "holiday" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprint" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "state" "SprintState" NOT NULL DEFAULT 'planned',
    "startedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprintCapacity" (
    "sprintId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "adjustmentDays" DECIMAL(4,1) NOT NULL,

    CONSTRAINT "sprintCapacity_pkey" PRIMARY KEY ("sprintId","userId")
);

-- CreateTable
CREATE TABLE "timeOff" (
    "id" UUID NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TimeOffType" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workItem" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "type" "WorkItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" JSONB NOT NULL DEFAULT '{"type":"doc"}',
    "criteria" JSONB NOT NULL DEFAULT '[]',
    "status" "WorkItemStatus" NOT NULL DEFAULT 'todo',
    "atRisk" BOOLEAN NOT NULL DEFAULT false,
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "points" INTEGER,
    "tags" TEXT[],
    "startDate" DATE,
    "targetDate" DATE,
    "sprintId" UUID,
    "rank" TEXT NOT NULL,
    "parentId" UUID,
    "assigneeId" TEXT,
    "reporterId" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workItemLink" (
    "id" UUID NOT NULL,
    "fromId" UUID NOT NULL,
    "toId" UUID NOT NULL,
    "kind" "WorkItemLinkKind" NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workItemLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" UUID NOT NULL,
    "workItemId" UUID NOT NULL,
    "authorId" TEXT,
    "body" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" UUID NOT NULL,
    "workItemId" UUID,
    "uploadedById" TEXT,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "workItemId" UUID,
    "actorId" TEXT,
    "action" "ActivityAction" NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" "NotificationType" NOT NULL,
    "workItemId" UUID,
    "sprintId" UUID,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- CreateIndex
CREATE INDEX "member_organizationId_idx" ON "member"("organizationId");

-- CreateIndex
CREATE INDEX "member_userId_idx" ON "member"("userId");

-- CreateIndex
CREATE INDEX "invitation_organizationId_idx" ON "invitation"("organizationId");

-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "invitation"("email");

-- CreateIndex
CREATE UNIQUE INDEX "project_organizationId_key_key" ON "project"("organizationId", "key");

-- CreateIndex
CREATE INDEX "projectMember_userId_idx" ON "projectMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_projectId_date_key" ON "holiday"("projectId", "date");

-- CreateIndex
CREATE INDEX "sprint_projectId_startDate_idx" ON "sprint"("projectId", "startDate");

-- CreateIndex
CREATE INDEX "timeOff_organizationId_startDate_endDate_idx" ON "timeOff"("organizationId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "timeOff_userId_startDate_idx" ON "timeOff"("userId", "startDate");

-- CreateIndex
CREATE INDEX "workItem_projectId_sprintId_rank_idx" ON "workItem"("projectId", "sprintId", "rank");

-- CreateIndex
CREATE INDEX "workItem_projectId_type_startDate_idx" ON "workItem"("projectId", "type", "startDate");

-- CreateIndex
CREATE INDEX "workItem_assigneeId_status_idx" ON "workItem"("assigneeId", "status");

-- CreateIndex
CREATE INDEX "workItem_parentId_idx" ON "workItem"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "workItem_projectId_number_key" ON "workItem"("projectId", "number");

-- CreateIndex
CREATE INDEX "workItemLink_toId_idx" ON "workItemLink"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "workItemLink_fromId_toId_kind_key" ON "workItemLink"("fromId", "toId", "kind");

-- CreateIndex
CREATE INDEX "comment_workItemId_createdAt_idx" ON "comment"("workItemId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "attachment_storageKey_key" ON "attachment"("storageKey");

-- CreateIndex
CREATE INDEX "attachment_workItemId_idx" ON "attachment"("workItemId");

-- CreateIndex
CREATE INDEX "activity_projectId_createdAt_idx" ON "activity"("projectId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "activity_workItemId_createdAt_idx" ON "activity"("workItemId", "createdAt");

-- CreateIndex
CREATE INDEX "notification_userId_createdAt_idx" ON "notification"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectMember" ADD CONSTRAINT "projectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectMember" ADD CONSTRAINT "projectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday" ADD CONSTRAINT "holiday_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprint" ADD CONSTRAINT "sprint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprintCapacity" ADD CONSTRAINT "sprintCapacity_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprintCapacity" ADD CONSTRAINT "sprintCapacity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeOff" ADD CONSTRAINT "timeOff_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeOff" ADD CONSTRAINT "timeOff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItem" ADD CONSTRAINT "workItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItem" ADD CONSTRAINT "workItem_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItem" ADD CONSTRAINT "workItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "workItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItem" ADD CONSTRAINT "workItem_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItem" ADD CONSTRAINT "workItem_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItemLink" ADD CONSTRAINT "workItemLink_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "workItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItemLink" ADD CONSTRAINT "workItemLink_toId_fkey" FOREIGN KEY ("toId") REFERENCES "workItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItemLink" ADD CONSTRAINT "workItemLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "workItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "workItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "workItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "workItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Rules Prisma can't express. It ignores CHECK constraints, so later migrations leave them alone.
ALTER TABLE "sprint" ADD CONSTRAINT "sprint_dates_check" CHECK ("endDate" >= "startDate");
ALTER TABLE "timeOff" ADD CONSTRAINT "timeOff_dates_check" CHECK ("endDate" >= "startDate");
-- A half day covers one day only.
ALTER TABLE "timeOff" ADD CONSTRAINT "timeOff_half_check" CHECK ("type" <> 'half' OR "startDate" = "endDate");
ALTER TABLE "workItem" ADD CONSTRAINT "workItem_dates_check" CHECK ("targetDate" IS NULL OR "startDate" IS NULL OR "targetDate" >= "startDate");
-- Story points go up to 34 (see workItemSchema).
ALTER TABLE "workItem" ADD CONSTRAINT "workItem_points_check" CHECK ("points" BETWEEN 0 AND 34);
ALTER TABLE "workItem" ADD CONSTRAINT "workItem_parent_check" CHECK ("parentId" <> "id");
ALTER TABLE "workItemLink" ADD CONSTRAINT "workItemLink_self_check" CHECK ("fromId" <> "toId");
