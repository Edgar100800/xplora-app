/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "type" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Role_type_key" ON "Role"("type");
