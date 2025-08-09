import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(_req: NextRequest) {
  try {
    const auth = await getAuthUserFromCookie();
    if (!auth || (auth.role !== "ADMIN" && auth.role !== "WALI_KELAS")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const tahun = await prisma.tahunAjaran.findFirst({ where: { aktif: true } });
    if (!tahun) return NextResponse.json({ success: true, data: [] });

    const kelas = await prisma.kelasTahunAjaran.findMany({
      where: { tahunAjaranId: tahun.id },
      select: {
        id: true,
        kelas: true,
        waliKelas: { select: { id: true, nama: true } },
        _count: { select: { siswa: true } },
      },
      orderBy: { kelas: "asc" },
    });

    const enriched = await Promise.all(
      kelas.map(async (k) => {
        const siswaDenganAktivitas = await prisma.siswa.count({
          where: {
            aktivitas: { some: {} },
            siswaKelas: { some: { kelasTahunAjaranId: k.id } },
          },
        });
        return {
          id: k.id,
          kelas: k.kelas,
          waliKelas: k.waliKelas,
          totalSiswa: k._count.siswa,
          siswaDenganAktivitas,
        };
      })
    );

    return NextResponse.json({ success: true, data: enriched });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
