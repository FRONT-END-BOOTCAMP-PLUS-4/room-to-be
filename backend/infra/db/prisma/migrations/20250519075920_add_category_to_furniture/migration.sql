/*
  Warnings:

  - You are about to drop the column `Category` on the `Furniture` table. All the data in the column will be lost.
  - Added the required column `category` to the `Furniture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Furniture" DROP COLUMN "Category",
ADD COLUMN     "category" TEXT NOT NULL;
