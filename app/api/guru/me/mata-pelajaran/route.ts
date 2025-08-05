import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser"; // ✅ disesuaikan dengan strukturmu

export async function GET() {
  try {
    const user = getAuthUserFromCookie();

    if (!user || user.role !== "GURU") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const guru = await prisma.guru.findUnique({
      where: { userId: user.id },
      include: {
        mapel: {
          include: {
            mataPelajaran: true,
            JadwalPelajaran: {
              include: {
                kelasTahunAjaran: {
                  select: {
                    id: true,
                    kelas: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!guru) {
      return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
    }

    const hasil = guru.mapel.map((gm) => ({
      guruMapelId: gm.id,
      mataPelajaran: gm.mataPelajaran.nama,
      kelas: gm.JadwalPelajaran.map((jadwal) => ({
        kelasId: jadwal.kelasTahunAjaran.id,
        kelas: jadwal.kelasTahunAjaran.kelas,
        hari: jadwal.hari,
        jamKe: jadwal.jamKe,
      })),
    }));

    return NextResponse.json(hasil);
  } catch (error) {
    console.error("Error fetching mata pelajaran guru:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
