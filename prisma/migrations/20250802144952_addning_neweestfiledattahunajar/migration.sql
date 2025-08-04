/*
  Warnings:

  - Added the required column `mulaiGanjil` to the `TahunAjaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selesaiGenap` to the `TahunAjaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TahunAjaran" ADD COLUMN     "mulaiGanjil" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "selesaiGenap" TIMESTAMP(3) NOT NULL;
