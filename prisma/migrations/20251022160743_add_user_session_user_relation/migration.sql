/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `UserResult` DROP FOREIGN KEY `UserResult_quizId_fkey`;

-- DropForeignKey
ALTER TABLE `UserResult` DROP FOREIGN KEY `UserResult_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserSession` DROP FOREIGN KEY `UserSession_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserResult` MODIFY `userId` VARCHAR(191) NULL,
    MODIFY `quizId` INTEGER NULL;

-- AlterTable
ALTER TABLE `UserSession` MODIFY `userId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_uuid_key` ON `User`(`uuid`);

-- AddForeignKey
ALTER TABLE `UserSession` ADD CONSTRAINT `UserSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResult` ADD CONSTRAINT `UserResult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResult` ADD CONSTRAINT `UserResult_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
