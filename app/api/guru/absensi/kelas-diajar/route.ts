import { NextResponse } from "next/server";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const jadwal = await prisma.jadwalPelajaran.findMany({
      where: {
        guruMapel: {
          guruId: guru.id,
        },
      },
      include: {
        guruMapel: {
          include: {
            mataPelajaran: true,
          },
        },
        kelasTahunAjaran: true,
      },
    });

    // Ambil daftar unik kelas & mapel
    const uniqueMap = new Map<string, { id: string; kelas: string; mataPelajaran: string }>();

    for (const j of jadwal) {
      const key = `${j.kelasTahunAjaran.id}-${j.guruMapel.mataPelajaran.nama}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          id: j.kelasTahunAjaran.id,
          kelas: j.kelasTahunAjaran.kelas,
          mataPelajaran: j.guruMapel.mataPelajaran.nama,
        });
      }
    }

    const result = Array.from(uniqueMap.values());

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching kelas diajar:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
