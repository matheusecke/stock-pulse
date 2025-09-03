/*
  Warnings:

  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add name column with default value, then remove default
ALTER TABLE `user` ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT 'User';
ALTER TABLE `user` ALTER COLUMN `name` DROP DEFAULT;
