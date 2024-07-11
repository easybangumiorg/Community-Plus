/*
  Warnings:

  - The values [DELETED] on the enum `Post_state` will be removed. If these variants are still used in the database, this will fail.
  - The values [DELETED] on the enum `Post_state` will be removed. If these variants are still used in the database, this will fail.
  - The values [DELETED] on the enum `Post_state` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `collection` MODIFY `state` ENUM('DRAFT', 'READY_PUB', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `parsemethod` MODIFY `state` ENUM('DRAFT', 'READY_PUB', 'PUBLISHED') NOT NULL;

-- AlterTable
ALTER TABLE `post` MODIFY `state` ENUM('DRAFT', 'READY_PUB', 'PUBLISHED') NOT NULL;
