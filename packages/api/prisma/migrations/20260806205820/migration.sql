-- CreateTable
CREATE TABLE "TodoGroupParticipant" (
    "id" TEXT NOT NULL,
    "todoGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TodoGroupParticipant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TodoGroupParticipant" ADD CONSTRAINT "TodoGroupParticipant_todoGroupId_fkey" FOREIGN KEY ("todoGroupId") REFERENCES "TodoGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoGroupParticipant" ADD CONSTRAINT "TodoGroupParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
