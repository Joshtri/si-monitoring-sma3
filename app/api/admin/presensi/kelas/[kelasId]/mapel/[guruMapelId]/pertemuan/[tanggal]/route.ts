import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

// helper: parse YYYY-MM-DD -> start/end of day
function dayBounds(dateStr: string) {
  const d = new Date(dateStr);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  const end   = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
}

export async function GET(_req: NextRequest, { params }: { params: { kelasId: string; guruMapelId: string; tanggal: string } }) {
  try {
    const auth = await getAuthUserFromCookie();
    if (!auth || !["ADMIN", "WALI_KELAS"].includes(auth.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { kelasId, guruMapelId, tanggal } = params;
    const gm = await prisma.guruMapel.findUnique({
      where: { id: guruMapelId },
      select: { guru: { select: { id: true, nama: true } }, mataPelajaran: { select: { nama: true } } },
    });
    if (!gm) return NextResponse.json({ success: false, message: "GuruMapel tidak ditemukan" }, { status: 404 });

    const { start, end } = dayBounds(tanggal);

    // Ambil semua siswa di kelas
    const siswaKelas = await prisma.siswaKelas.findMany({
      where: { kelasTahunAjaranId: kelasId },
      select: {
        id: true,
        siswa: {
          select: { id: true, namaDepan: true, namaTengah: true, namaBelakang: true, nis: true, nisn: true },
        },
      },
      orderBy: { siswa: { namaDepan: "asc" } },
    });

    // Ambil absen pada tanggal tsb (oleh guru pengampu)
    const absensi = await prisma.absen.findMany({
      where: {
        guruId: gm.guru.id,
        siswaKelasId: { in: siswaKelas.map(s => s.id) },
        tanggal: { gte: start, lte: end },
      },
      select: { siswaKelasId: true, status: true, keterangan: true },
    });
    const map = new Map(absensi.map(a => [a.siswaKelasId, a]));

    const records = siswaKelas.map((sk) => {
      const s = sk.siswa;
      const nama = [s.namaDepan, s.namaTengah, s.namaBelakang].filter(Boolean).join(" ");
      const row = map.get(sk.id);
      return {
        siswaId: s.id,
        nama,
        nis: s.nis,
        nisn: s.nisn,
        status: row?.status ?? "BELUM_ABSEN",
        keterangan: row?.keterangan ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        tanggal,
        mapel: gm.mataPelajaran.nama,
        guru: gm.guru,
        presensi: records,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
