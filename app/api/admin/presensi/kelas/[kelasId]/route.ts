import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(_req: NextRequest, { params }: { params: { kelasId: string } }) {
  try {
    const auth = await getAuthUserFromCookie();
    if (!auth || !["ADMIN", "WALI_KELAS"].includes(auth.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { kelasId } = params;

    const kelas = await prisma.kelasTahunAjaran.findUnique({
      where: { id: kelasId },
      select: {
        id: true,
        kelas: true,
        waliKelas: { select: { id: true, nama: true, nip: true } },
        tahunAjaran: { select: { id: true, tahun: true, aktif: true } },
      },
    });
    if (!kelas) return NextResponse.json({ success: false, message: "Kelas tidak ditemukan" }, { status: 404 });

    // Semua jadwal (Senin–Jumat) untuk kelas ini + guru/mapel
    const jadwal = await prisma.jadwalPelajaran.findMany({
      where: { kelasTahunAjaranId: kelasId },
      select: {
        id: true,
        hari: true,
        jamKe: true,
        guruMapelId: true,
        guruMapel: {
          select: {
            id: true,
            guru: { select: { id: true, nama: true } },
            mataPelajaran: { select: { id: true, nama: true } },
          },
        },
      },
      orderBy: [{ hari: "asc" }, { jamKe: "asc" }],
    });

    // Hitung jumlah pertemuan (distinct tanggal) per guruMapel via groupBy(tanggal)
    const enriched = await Promise.all(
      jadwal.map(async (j) => {
        const groups = await prisma.absen.groupBy({
          by: ["tanggal"],
          where: {
            guruId: j.guruMapel.guru.id,
            siswaKelas: { kelasTahunAjaranId: kelasId },
          },
          _count: { tanggal: true },
        });
        return {
          jadwalId: j.id,
          hari: j.hari,
          jamKe: j.jamKe,
          guruMapelId: j.guruMapelId,
          mapel: j.guruMapel.mataPelajaran.nama,
          guruPengampu: { id: j.guruMapel.guru.id, nama: j.guruMapel.guru.nama },
          totalPertemuan: groups.length,
        };
      })
    );

    return NextResponse.json({ success: true, data: { kelas, mapel: enriched } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
