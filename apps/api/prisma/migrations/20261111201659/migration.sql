/*
  Warnings:

  - You are about to alter the column `capacity` on the `sprint` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,1)`.

*/
-- AlterTable
ALTER TABLE "sprint" ALTER COLUMN "capacity" SET DEFAULT 0,
ALTER COLUMN "capacity" SET DATA TYPE DECIMAL(4,1);
