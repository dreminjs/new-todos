/*
  Warnings:

  - Added the required column `code` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TodoParticipant" DROP CONSTRAINT "TodoParticipant_todoId_fkey";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "code" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TodoParticipant" ADD CONSTRAINT "TodoParticipant_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
