/*
  Warnings:

  - You are about to drop the column `status` on the `WorkspaceParticipant` table. All the data in the column will be lost.
  - You are about to drop the `WorkspaceRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WorkspaceUserRole" AS ENUM ('OWNER', 'MEMBER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "WorkspaceParticipant" DROP CONSTRAINT "WorkspaceParticipant_roleId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceRole" DROP CONSTRAINT "WorkspaceRole_workspaceId_fkey";

-- AlterTable
ALTER TABLE "WorkspaceParticipant" DROP COLUMN "status",
ADD COLUMN     "role" "WorkspaceUserRole" NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE "WorkspaceRole";

-- DropEnum
DROP TYPE "WorkspaceUserStatus";

-- CreateTable
CREATE TABLE "WorkspaceStatus" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "WorkspaceStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkspaceParticipant" ADD CONSTRAINT "WorkspaceParticipant_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "WorkspaceStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceStatus" ADD CONSTRAINT "WorkspaceStatus_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
