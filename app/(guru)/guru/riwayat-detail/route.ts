// File: app/api/guru/absensi/riwayat-detail/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

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
      return NextResponse.json({ message: "kelasId harus disertakan" }, { status: 400 });
    }

    // Validasi apakah guru mengajar di kelas ini
    const isMengajar = await prisma.jadwalPelajaran.findFirst({
      where: {
        guruMapel: { guruId: guru.id },
        kelasTahunAjaranId: kelasId,
      },
    });

    if (!isMengajar) {
      return NextResponse.json({ message: "Guru tidak mengajar di kelas ini" }, { status: 403 });
    }

    const absensi = await prisma.absen.findMany({
      where: {
        guruId: guru.id,
        siswaKelas: {
          kelasTahunAjaranId: kelasId,
        },
      },
      include: {
        siswaKelas: {
          include: {
            siswa: true,
          },
        },
      },
      orderBy: { tanggal: "desc" },
    });

    const grouped = absensi.reduce((acc: Record<string, any[]>, absen) => {
      const key = absen.tanggal.toISOString().split("T")[0];
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        nama: absen.siswaKelas.siswa.namaDepan + (absen.siswaKelas.siswa.namaBelakang ? ' ' + absen.siswaKelas.siswa.namaBelakang : ''),
        nis: absen.siswaKelas.siswa.nis,
        status: absen.status,
        keterangan: absen.keterangan || null,
      });
      return acc;
    }, {});

    const result = Object.entries(grouped).map(([tanggal, siswa]) => ({ tanggal, siswa }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching riwayat detail:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
