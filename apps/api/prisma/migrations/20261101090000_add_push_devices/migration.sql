-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('ios', 'android', 'web');

-- CreateTable
CREATE TABLE "pushDevice" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "fid" TEXT NOT NULL,
    "platform" "PushPlatform" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pushDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pushDevice_fid_key" ON "pushDevice"("fid");

-- CreateIndex
CREATE INDEX "pushDevice_userId_idx" ON "pushDevice"("userId");

-- AddForeignKey
ALTER TABLE "pushDevice" ADD CONSTRAINT "pushDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

