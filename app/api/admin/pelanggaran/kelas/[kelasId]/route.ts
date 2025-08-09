import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(
  req: NextRequest,
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

    // Ambil semua siswa di kelas tsb
    const siswaList = await prisma.siswa.findMany({
      where: { siswaKelas: { some: { kelasTahunAjaranId: kelasId } } },
      select: {
        id: true,
        namaDepan: true,
        namaTengah: true,
        namaBelakang: true,
        nis: true,
        nisn: true,
        _count: { select: { pelanggaran: true } },
        pelanggaran: {
          select: { id: true, poin: true, tanggal: true },
          orderBy: { tanggal: "desc" },
          take: 1, // untuk lastViolation
        },
      },
      orderBy: [{ namaDepan: "asc" }, { namaBelakang: "asc" }],
    });

    // Format ringkasan
    const students = await Promise.all(
      siswaList.map(async (s) => {
        // Sum poin total (kalau perlu total poin, kita hitung sekalian)
        const agg = await prisma.pelanggaran.aggregate({
          where: { siswaId: s.id },
          _sum: { poin: true },
        });

        const fullName = [s.namaDepan, s.namaTengah, s.namaBelakang].filter(Boolean).join(" ");
        return {
          id: s.id,
          nama: fullName,
          nis: s.nis,
          nisn: s.nisn,
          totalPelanggaran: s._count.pelanggaran,
          totalPoin: agg._sum.poin ?? 0,
          lastViolationAt: s.pelanggaran[0]?.tanggal ?? null,
          hasViolation: s._count.pelanggaran > 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        kelas,
        students,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
