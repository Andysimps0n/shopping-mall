/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `providerId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerUserId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerUserId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `provider` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('kakao', 'naver');

-- DropIndex
DROP INDEX "users_provider_providerId_key";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "providerId",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "providerUserId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "provider",
ADD COLUMN     "provider" "AuthProvider" NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_providerUserId_key" ON "users"("provider", "providerUserId");
