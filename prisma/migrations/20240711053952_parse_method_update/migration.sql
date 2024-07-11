/*
  Warnings:

  - You are about to drop the column `metaData` on the `parsemethod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `ParseMethod` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flow` to the `ParseMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parsemethod` DROP COLUMN `metaData`,
    ADD COLUMN `flow` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ParseMethod_code_key` ON `ParseMethod`(`code`);
