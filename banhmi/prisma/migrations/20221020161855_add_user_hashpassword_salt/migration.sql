/*
  Warnings:

  - Added the required column `hashPassword` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hashPassword" TEXT NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL;
