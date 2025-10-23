/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the column `createdAt` on the `UserResult` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserSession` table. All the data in the column will be lost.
  - You are about to alter the column `sessionId` on the `UserSession` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `UserResult` DROP FOREIGN KEY `UserResult_quizId_fkey`;

-- DropForeignKey
ALTER TABLE `UserResult` DROP FOREIGN KEY `UserResult_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserSession` DROP FOREIGN KEY `UserSession_quizId_fkey`;

-- DropIndex
DROP INDEX `UserSession_sessionId_key` ON `UserSession`;

-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `UserResult` DROP COLUMN `createdAt`,
    ADD COLUMN `sessionId` VARCHAR(191) NULL,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `UserSession` DROP COLUMN `createdAt`,
    MODIFY `sessionId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `UserSession` ADD CONSTRAINT `UserSession_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResult` ADD CONSTRAINT `UserResult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResult` ADD CONSTRAINT `UserResult_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
