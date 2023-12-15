/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Collection` table. All the data in the column will be lost.
  - Added the required column `state` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Collection` DROP COLUMN `isPublic`,
    ADD COLUMN `state` ENUM('DRAFT', 'ON_PRIMARY', 'ON_SECONDARY') NOT NULL;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `onReadyPub` BOOLEAN NOT NULL DEFAULT false;
