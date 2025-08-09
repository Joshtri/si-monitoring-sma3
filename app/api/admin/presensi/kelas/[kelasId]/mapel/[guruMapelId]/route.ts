import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(_req: NextRequest, { params }: { params: { kelasId: string; guruMapelId: string } }) {
  try {
    const auth = await getAuthUserFromCookie();
    if (!auth || !["ADMIN", "WALI_KELAS"].includes(auth.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { kelasId, guruMapelId } = params;

    const gm = await prisma.guruMapel.findUnique({
      where: { id: guruMapelId },
      select: {
        id: true,
        guru: { select: { id: true, nama: true } },
        mataPelajaran: { select: { id: true, nama: true } },
      },
    });
    if (!gm) return NextResponse.json({ success: false, message: "GuruMapel tidak ditemukan" }, { status: 404 });

    // groupBy tanggal untuk pertemuan2
    const pertemuan = await prisma.absen.groupBy({
      by: ["tanggal"],
      where: {
        guruId: gm.guru.id,
        siswaKelas: { kelasTahunAjaranId: kelasId },
      },
      _count: { _all: true },
    });

    // hitung ringkasan status per tanggal
    const meetings = await Promise.all(
      pertemuan
        .sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1))
        .map(async (g) => {
          const rows = await prisma.absen.groupBy({
            by: ["status"],
            where: {
              guruId: gm.guru.id,
              siswaKelas: { kelasTahunAjaranId: kelasId },
              tanggal: g.tanggal,
            },
            _count: { _all: true },
          });
          const summary: Record<string, number> = {};
          rows.forEach(r => (summary[r.status] = r._count._all));
          return { tanggal: g.tanggal, total: g._count._all, summary };
        })
    );

    return NextResponse.json({
      success: true,
      data: {
        mapel: { id: gm.id, nama: gm.mataPelajaran.nama, guru: gm.guru },
        pertemuan: meetings,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
