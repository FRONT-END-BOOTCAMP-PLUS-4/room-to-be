/*
  Warnings:

  - You are about to drop the column `scale` on the `PlacedFurniture` table. All the data in the column will be lost.
  - Added the required column `placement_type` to the `Furniture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scale_x` to the `PlacedFurniture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scale_y` to the `PlacedFurniture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scale_z` to the `PlacedFurniture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Furniture" ADD COLUMN     "placement_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlacedFurniture" DROP COLUMN "scale",
ADD COLUMN     "scale_x" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "scale_y" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "scale_z" DOUBLE PRECISION NOT NULL;
