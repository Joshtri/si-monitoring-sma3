/*
  Warnings:

  - You are about to drop the column `guruId` on the `JadwalPelajaran` table. All the data in the column will be lost.
  - You are about to drop the column `mataPelajaranId` on the `JadwalPelajaran` table. All the data in the column will be lost.
  - Added the required column `guruMapelId` to the `JadwalPelajaran` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."JadwalPelajaran" DROP CONSTRAINT "JadwalPelajaran_guruId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JadwalPelajaran" DROP CONSTRAINT "JadwalPelajaran_mataPelajaranId_fkey";

-- AlterTable
ALTER TABLE "public"."JadwalPelajaran" DROP COLUMN "guruId",
DROP COLUMN "mataPelajaranId",
ADD COLUMN     "guruMapelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_guruMapelId_fkey" FOREIGN KEY ("guruMapelId") REFERENCES "public"."GuruMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
