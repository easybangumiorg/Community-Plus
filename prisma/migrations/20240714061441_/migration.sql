/*
  Warnings:

  - You are about to drop the column `publishDate` on the `post` table. All the data in the column will be lost.
  - Added the required column `publishedDate` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `publishDate`,
    ADD COLUMN `publishedDate` DATETIME(3) NOT NULL,
    ADD COLUMN `updateAt` ENUM('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NOT NULL;
