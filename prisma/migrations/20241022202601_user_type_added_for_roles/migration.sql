/*
  Warnings:

  - Added the required column `type` to the `Roles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'VENDOR', 'CUSTOMER');

-- AlterTable
ALTER TABLE "Roles" ADD COLUMN     "type" "UserType" NOT NULL;
