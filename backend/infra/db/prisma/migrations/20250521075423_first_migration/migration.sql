/*
  Warnings:

  - You are about to drop the column `type` on the `Furniture` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Furniture" DROP COLUMN "type",
ADD COLUMN     "scale_x" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "scale_y" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "scale_z" DOUBLE PRECISION NOT NULL DEFAULT 1.0;
