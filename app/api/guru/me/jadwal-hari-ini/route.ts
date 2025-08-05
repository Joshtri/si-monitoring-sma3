// File: app/api/guru/me/jadwal-hari-ini/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

const getCurrentDayName = (): string => {
  return new Date().toLocaleDateString("id-ID", { weekday: "long" });
};
export async function GET() {
  try {
    const user = getAuthUserFromCookie();
    if (!user || user.role !== "GURU") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const guru = await prisma.guru.findUnique({
      where: { userId: user.id },
    });

    if (!guru) {
      return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
    }

    const today = getCurrentDayName();

    const jadwalHariIni = await prisma.jadwalPelajaran.findMany({
      where: {
        guruMapel: { guruId: guru.id },
        hari: today,
      },
      include: {
        kelasTahunAjaran: true,
        guruMapel: {
          include: { mataPelajaran: true },
        },
      },
      orderBy: { jamKe: "asc" },
    });

    const result = jadwalHariIni.map((jadwal) => ({
      kelas: jadwal.kelasTahunAjaran.kelas,
      mataPelajaran: jadwal.guruMapel.mataPelajaran.nama,
      jamKe: jadwal.jamKe,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching jadwal hari ini:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
