-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ORANG_TUA', 'WALI_KELAS', 'GURU', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "public"."AbsenStatus" AS ENUM ('HADIR', 'SAKIT', 'IZIN', 'ALPHA');

-- CreateEnum
CREATE TYPE "public"."JenisNilai" AS ENUM ('TUGAS', 'ULANGAN', 'UTS', 'UAS');

-- CreateEnum
CREATE TYPE "public"."JenisAktivitas" AS ENUM ('EKSTRAKURIKULER', 'ORGANISASI', 'LOMBA');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('usr_', gen_random_uuid()),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Guru" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GuruMapel" (
    "id" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "mataPelajaranId" TEXT NOT NULL,

    CONSTRAINT "GuruMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrangTua" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OrangTua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Siswa" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('swa_', gen_random_uuid()),
    "namaDepan" TEXT NOT NULL,
    "namaTengah" TEXT,
    "namaBelakang" TEXT,
    "nisn" TEXT,
    "nis" TEXT,
    "jenisKelamin" "public"."JenisKelamin" NOT NULL,
    "alamat" TEXT,
    "orangTuaId" TEXT NOT NULL,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SiswaKelas" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "kelasTahunAjaranId" TEXT NOT NULL,

    CONSTRAINT "SiswaKelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TahunAjaran" (
    "id" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL,

    CONSTRAINT "TahunAjaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KelasTahunAjaran" (
    "id" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "waliKelasId" TEXT,

    CONSTRAINT "KelasTahunAjaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MataPelajaran" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MataPelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JadwalPelajaran" (
    "id" TEXT NOT NULL,
    "kelasTahunAjaranId" TEXT NOT NULL,
    "hari" TEXT NOT NULL,
    "jamKe" INTEGER NOT NULL,
    "guruId" TEXT NOT NULL,
    "mataPelajaranId" TEXT NOT NULL,

    CONSTRAINT "JadwalPelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Absen" (
    "id" TEXT NOT NULL,
    "siswaKelasId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" "public"."AbsenStatus" NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "Absen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nilai" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "mapel" TEXT NOT NULL,
    "jenis" "public"."JenisNilai" NOT NULL,
    "nilai" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,

    CONSTRAINT "Nilai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pelanggaran" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "jenisPelanggaran" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "poin" INTEGER NOT NULL,
    "tindakan" TEXT NOT NULL,

    CONSTRAINT "Pelanggaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Aktivitas" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "namaKegiatan" TEXT NOT NULL,
    "jenis" "public"."JenisAktivitas" NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "Aktivitas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "public"."User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "public"."Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_userId_key" ON "public"."Guru"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrangTua_userId_key" ON "public"."OrangTua"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nisn_key" ON "public"."Siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nis_key" ON "public"."Siswa"("nis");

-- AddForeignKey
ALTER TABLE "public"."Guru" ADD CONSTRAINT "Guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuruMapel" ADD CONSTRAINT "GuruMapel_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "public"."Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuruMapel" ADD CONSTRAINT "GuruMapel_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "public"."MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrangTua" ADD CONSTRAINT "OrangTua_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Siswa" ADD CONSTRAINT "Siswa_orangTuaId_fkey" FOREIGN KEY ("orangTuaId") REFERENCES "public"."OrangTua"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SiswaKelas" ADD CONSTRAINT "SiswaKelas_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "public"."Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SiswaKelas" ADD CONSTRAINT "SiswaKelas_kelasTahunAjaranId_fkey" FOREIGN KEY ("kelasTahunAjaranId") REFERENCES "public"."KelasTahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KelasTahunAjaran" ADD CONSTRAINT "KelasTahunAjaran_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "public"."TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KelasTahunAjaran" ADD CONSTRAINT "KelasTahunAjaran_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES "public"."Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_kelasTahunAjaranId_fkey" FOREIGN KEY ("kelasTahunAjaranId") REFERENCES "public"."KelasTahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "public"."Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "public"."MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Absen" ADD CONSTRAINT "Absen_siswaKelasId_fkey" FOREIGN KEY ("siswaKelasId") REFERENCES "public"."SiswaKelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Nilai" ADD CONSTRAINT "Nilai_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "public"."Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pelanggaran" ADD CONSTRAINT "Pelanggaran_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "public"."Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Aktivitas" ADD CONSTRAINT "Aktivitas_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "public"."Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
