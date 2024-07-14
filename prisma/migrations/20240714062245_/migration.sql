-- AlterTable
ALTER TABLE `post` MODIFY `updateState` ENUM('FINISHED', 'AIRING', 'NOT_YET_RELEASED', 'CANCELLED') NULL,
    MODIFY `nsfw` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `summary` VARCHAR(191) NULL,
    MODIFY `cover` VARCHAR(191) NOT NULL DEFAULT 'https://easybangumi.org/icons/FAVICON-RAW.png',
    MODIFY `extendmetaData` JSON NULL,
    MODIFY `publishedDate` DATETIME(3) NULL,
    MODIFY `updateAt` ENUM('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NULL;
