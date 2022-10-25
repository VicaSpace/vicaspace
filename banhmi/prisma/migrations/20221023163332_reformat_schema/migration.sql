/*
  Warnings:

  - You are about to drop the column `hashPassword` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[auth_token_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashed_password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hashPassword",
ADD COLUMN     "auth_token_id" INTEGER,
ADD COLUMN     "hashed_password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_token_id_key" ON "users"("auth_token_id");
