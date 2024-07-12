/*
  Warnings:

  - You are about to drop the column `choreographyId` on the `collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `collection` DROP FOREIGN KEY `Collection_choreographyId_fkey`;

-- AlterTable
ALTER TABLE `collection` DROP COLUMN `choreographyId`;

-- CreateTable
CREATE TABLE `ChoreographyItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `choreographyId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `weight` INTEGER NOT NULL,
    `collectionId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChoreographyItem` ADD CONSTRAINT `ChoreographyItem_choreographyId_fkey` FOREIGN KEY (`choreographyId`) REFERENCES `Choreography`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChoreographyItem` ADD CONSTRAINT `ChoreographyItem_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
