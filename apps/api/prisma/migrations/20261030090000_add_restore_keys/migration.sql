-- CreateTable
CREATE TABLE "restoreKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restoreKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "restoreKey_userId_idx" ON "restoreKey"("userId");

-- CreateIndex
CREATE INDEX "restoreKey_sessionId_idx" ON "restoreKey"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "restoreKey_credentialID_key" ON "restoreKey"("credentialID");

-- AddForeignKey
ALTER TABLE "restoreKey" ADD CONSTRAINT "restoreKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restoreKey" ADD CONSTRAINT "restoreKey_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

