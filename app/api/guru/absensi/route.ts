import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { AbsenStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie();

    if (!user || user.role !== "GURU") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const guru = await prisma.guru.findUnique({
      where: { userId: user.id },
    });

    if (!guru) {
      return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
    }

    const body = await req.json();

    if (!body?.absensiData || !Array.isArray(body.absensiData)) {
      return NextResponse.json({ message: "Format tidak valid" }, { status: 400 });
    }

    const today = new Date();
    const tanggal = new Date(today.toISOString().split("T")[0]);

    // Optional: hindari duplikat absen untuk siswa di tanggal yang sama
    // Bisa dihapus jika tidak perlu
    const existingAbsen = await prisma.absen.findMany({
      where: {
        tanggal,
        siswaKelasId: {
          in: body.absensiData.map((d: any) => d.siswaKelasId),
        },
      },
    });

    const existingIds = new Set(existingAbsen.map((absen) => absen.siswaKelasId));

    const dataToInsert = body.absensiData
      .filter((entry: any) => !existingIds.has(entry.siswaKelasId))
      .map((entry: any) => ({
        siswaKelasId: entry.siswaKelasId,
        guruId: guru.id,
        status: entry.status as AbsenStatus,
        keterangan: entry.keterangan ?? null,
        tanggal,
      }));

    if (dataToInsert.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Semua siswa sudah diabsen hari ini",
        count: 0,
      });
    }

    const created = await prisma.absen.createMany({
      data: dataToInsert,
    });

    return NextResponse.json({
      success: true,
      message: "Absensi berhasil disimpan",
      count: created.count,
    });
  } catch (error) {
    console.error("Error menyimpan absensi:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
