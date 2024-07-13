/*
  Warnings:

  - Made the column `collectionId` on table `choreographyitem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `choreographyitem` DROP FOREIGN KEY `ChoreographyItem_collectionId_fkey`;

-- AlterTable
ALTER TABLE `choreographyitem` MODIFY `collectionId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ChoreographyItem` ADD CONSTRAINT `ChoreographyItem_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
