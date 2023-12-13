/*
  Warnings:

  - Added the required column `cover` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Collection` ADD COLUMN `cover` VARCHAR(191) NOT NULL;
