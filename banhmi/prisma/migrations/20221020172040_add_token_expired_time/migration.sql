/*
  Warnings:

  - Added the required column `expiredTime` to the `auth_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `auth_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auth_tokens" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiredTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
