import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import type { JenisAktivitas } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: { kelasId: string } }
) {
  try {
    const auth = await getAuthUserFromCookie();
    if (!auth || (auth.role !== "ADMIN" && auth.role !== "WALI_KELAS")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { kelasId } = params;

    const kelas = await prisma.kelasTahunAjaran.findUnique({
      where: { id: kelasId },
      select: {
        id: true,
        kelas: true,
        waliKelas: { select: { id: true, nama: true } },
        tahunAjaran: { select: { id: true, tahun: true, aktif: true } },
      },
    });
    if (!kelas) {
      return NextResponse.json({ success: false, message: "Kelas tidak ditemukan" }, { status: 404 });
    }

    const siswaList = await prisma.siswa.findMany({
      where: { siswaKelas: { some: { kelasTahunAjaranId: kelasId } } },
      select: {
        id: true,
        namaDepan: true,
        namaTengah: true,
        namaBelakang: true,
        nis: true,
        nisn: true,
      },
      orderBy: [{ namaDepan: "asc" }, { namaBelakang: "asc" }],
    });

    const students = await Promise.all(
      siswaList.map(async (s) => {
        const latest = await prisma.aktivitas.findFirst({
          where: { siswaId: s.id },
          orderBy: { tanggal: "desc" },
          select: { tanggal: true },
        });

        // count per jenis (opsional, buat ringkasan mini)
        const grouped = await prisma.aktivitas.groupBy({
          by: ["jenis"],
          where: { siswaId: s.id },
          _count: { jenis: true },
        });

        const byJenis: Partial<Record<JenisAktivitas, number>> = {};
        for (const g of grouped) {
          // @ts-ignore
          byJenis[g.jenis as JenisAktivitas] = g._count.jenis;
        }

        const totalAktivitas = grouped.reduce((a, b) => a + b._count.jenis, 0);
        const fullName = [s.namaDepan, s.namaTengah, s.namaBelakang].filter(Boolean).join(" ");

        return {
          id: s.id,
          nama: fullName,
          nis: s.nis,
          nisn: s.nisn,
          totalAktivitas,
          perJenis: {
            EKSTRAKURIKULER: byJenis.EKSTRAKURIKULER ?? 0,
            ORGANISASI: byJenis.ORGANISASI ?? 0,
            LOMBA: byJenis.LOMBA ?? 0,
          },
          lastActivityAt: latest?.tanggal ?? null,
          hasAktivitas: totalAktivitas > 0,
        };
      })
    );

    return NextResponse.json({ success: true, data: { kelas, students } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
