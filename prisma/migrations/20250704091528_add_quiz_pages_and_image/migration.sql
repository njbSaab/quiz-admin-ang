-- AlterTable
ALTER TABLE `Question` ADD COLUMN `image` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Quiz` ADD COLUMN `finalPage` TEXT NULL,
    ADD COLUMN `firstPage` TEXT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
