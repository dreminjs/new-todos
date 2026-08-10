/*
  Warnings:

  - You are about to drop the column `roleId` on the `WorkspaceParticipant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkspaceParticipant" DROP CONSTRAINT "WorkspaceParticipant_roleId_fkey";

-- AlterTable
ALTER TABLE "WorkspaceParticipant" DROP COLUMN "roleId",
ADD COLUMN     "statusId" TEXT;

-- AddForeignKey
ALTER TABLE "WorkspaceParticipant" ADD CONSTRAINT "WorkspaceParticipant_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "WorkspaceStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
