-- DropForeignKey
ALTER TABLE `UserSession` DROP FOREIGN KEY `UserSession_quizId_fkey`;

-- AlterTable
ALTER TABLE `UserSession` MODIFY `quizId` INTEGER NULL,
    MODIFY `currentQuestionIndex` INTEGER NOT NULL DEFAULT 0,
    MODIFY `correctAnswersCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `totalPoints` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `UserSession` ADD CONSTRAINT `UserSession_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
