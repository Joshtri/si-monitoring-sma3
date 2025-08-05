import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const kelasId = searchParams.get("kelasId");

    if (!kelasId) {
      return NextResponse.json({ message: "kelasId wajib diisi" }, { status: 400 });
    }

    const absensi = await prisma.absen.findMany({
      where: {
        guruId: guru.id,
        siswaKelas: {
          kelasTahunAjaranId: kelasId,
        },
      },
      select: {
        tanggal: true,
      },
    });

    // Kelompokkan berdasarkan tanggal
    const grouped: Record<string, number> = {};

    for (const a of absensi) {
      const dateKey = a.tanggal.toISOString().split("T")[0];
      grouped[dateKey] = (grouped[dateKey] || 0) + 1;
    }

    const result = Object.entries(grouped).map(([tanggal, jumlah]) => ({
      tanggal,
      jumlah,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching riwayat absensi:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
