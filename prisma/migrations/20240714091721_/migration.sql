-- CreateIndex
CREATE FULLTEXT INDEX `Post_title_summary_idx` ON `Post`(`title`, `summary`);
