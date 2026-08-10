/*
  Warnings:

  - You are about to drop the `TodoParticipant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TodoParticipant" DROP CONSTRAINT "TodoParticipant_todoId_fkey";

-- DropForeignKey
ALTER TABLE "TodoParticipant" DROP CONSTRAINT "TodoParticipant_userId_fkey";

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TodoParticipant";

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
