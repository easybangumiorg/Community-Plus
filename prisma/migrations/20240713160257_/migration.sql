/*
  Warnings:

  - Made the column `cover` on table `collection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `collection` MODIFY `cover` VARCHAR(191) NOT NULL DEFAULT 'https://easybangumi.org/icons/FAVICON-RAW.png';
