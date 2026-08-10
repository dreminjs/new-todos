/*
  Warnings:

  - You are about to drop the column `userId` on the `TodoGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TodoGroup" DROP CONSTRAINT "TodoGroup_userId_fkey";

-- AlterTable
ALTER TABLE "TodoGroup" DROP COLUMN "userId";
