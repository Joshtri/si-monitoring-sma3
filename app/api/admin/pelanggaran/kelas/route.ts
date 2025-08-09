import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUserFromCookie();
    if (!auth || (auth.role !== "ADMIN" && auth.role !== "WALI_KELAS")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Ambil TahunAjaran aktif
    const tahun = await prisma.tahunAjaran.findFirst({ where: { aktif: true } });
    if (!tahun) {
      return NextResponse.json({ success: true, data: [] });
    }

    const kelas = await prisma.kelasTahunAjaran.findMany({
      where: { tahunAjaranId: tahun.id },
      select: {
        id: true,
        kelas: true,
        waliKelas: { select: { id: true, nama: true } },
        _count: { select: { siswa: true } }, // total siswa (SiswaKelas)
      },
      orderBy: { kelas: "asc" },
    });

    // Hitung siswa yang punya pelanggaran per kelas (tanpa heavy include)
    const enriched = await Promise.all(
      kelas.map(async (k) => {
        const siswaDenganPelanggaran = await prisma.siswa.count({
          where: {
            pelanggaran: { some: {} },
            siswaKelas: { some: { kelasTahunAjaranId: k.id } },
          },
        });
        return {
          id: k.id,
          kelas: k.kelas,
          waliKelas: k.waliKelas,
          totalSiswa: k._count.siswa,
          siswaDenganPelanggaran,
        };
      })
    );

    return NextResponse.json({ success: true, data: enriched });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
