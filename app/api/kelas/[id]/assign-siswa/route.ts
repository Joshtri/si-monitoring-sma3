// /api/kelas/[id]/assign-siswa/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { siswaIds }: { siswaIds: string[] } = body;
    const kelasTahunAjaranId = params.id;

    // Dapatkan tahun ajaran dari kelas ini
    const kelas = await prisma.kelasTahunAjaran.findUnique({
      where: { id: kelasTahunAjaranId },
      include: { tahunAjaran: true },
    });

    if (!kelas) {
      return NextResponse.json({ message: "Kelas tidak ditemukan" }, { status: 404 });
    }

    const tahunAjaranId = kelas.tahunAjaranId;

    // Cek siswa mana saja yang sudah masuk ke kelas manapun dalam tahun ajaran yang sama
    const existing = await prisma.siswaKelas.findMany({
      where: {
        siswaId: { in: siswaIds },
        kelasTahunAjaran: {
          tahunAjaranId,
        },
      },
      select: {
        siswaId: true,
      },
    });

    const existingIds = new Set(existing.map((e) => e.siswaId));

    // Filter siswa yang belum terdaftar di tahun ajaran ini
    const validSiswaIds = siswaIds.filter((id) => !existingIds.has(id));

    const data = validSiswaIds.map((siswaId) => ({
      siswaId,
      kelasTahunAjaranId,
    }));

    if (data.length > 0) {
      await prisma.siswaKelas.createMany({ data, skipDuplicates: true });
    }

    return NextResponse.json({
      message: "Proses selesai",
      successCount: data.length,
      skippedCount: siswaIds.length - data.length,
      skippedIds: [...existingIds],
    });
  } catch (error) {
    console.error("[ASSIGN_SISWA_ERROR]", error);
    return NextResponse.json(
      { message: "Gagal menambahkan siswa", error },
      { status: 500 }
    );
  }
}
