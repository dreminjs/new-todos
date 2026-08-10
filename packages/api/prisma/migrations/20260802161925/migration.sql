/*
  Warnings:

  - The values [ADMIN] on the enum `WorkspaceUserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkspaceUserRole_new" AS ENUM ('OWNER', 'MEMBER', 'MANAGER');
ALTER TABLE "public"."WorkspaceParticipant" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "WorkspaceParticipant" ALTER COLUMN "role" TYPE "WorkspaceUserRole_new" USING ("role"::text::"WorkspaceUserRole_new");
ALTER TYPE "WorkspaceUserRole" RENAME TO "WorkspaceUserRole_old";
ALTER TYPE "WorkspaceUserRole_new" RENAME TO "WorkspaceUserRole";
DROP TYPE "public"."WorkspaceUserRole_old";
ALTER TABLE "WorkspaceParticipant" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;
