/*
  Warnings:

  - You are about to drop the column `placeOfBrith` on the `Customers` table. All the data in the column will be lost.
  - You are about to drop the column `placeOfBrith` on the `Employees` table. All the data in the column will be lost.
  - Added the required column `placeOfBirth` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placeOfBirth` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customers" DROP COLUMN "placeOfBrith",
ADD COLUMN     "placeOfBirth" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Employees" DROP COLUMN "placeOfBrith",
ADD COLUMN     "placeOfBirth" TEXT NOT NULL;
