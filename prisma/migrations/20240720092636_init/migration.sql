/*
  Warnings:

  - Added the required column `personalMsg` to the `Referral` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `referral` ADD COLUMN `personalMsg` VARCHAR(191) NOT NULL;
