/*
  Warnings:

  - Added the required column `Category` to the `Furniture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Furniture" ADD COLUMN     "Category" TEXT NOT NULL;
