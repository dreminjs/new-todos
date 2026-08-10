-- AlterTable
ALTER TABLE "TodoGroup" ADD COLUMN     "workspaceId" TEXT;

-- AddForeignKey
ALTER TABLE "TodoGroup" ADD CONSTRAINT "TodoGroup_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
