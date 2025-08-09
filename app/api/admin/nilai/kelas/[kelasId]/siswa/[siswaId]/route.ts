import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { kelasId: string; siswaId: string } }
) {
  try {
    const auth = await getAuthUserFromCookie();
    if (!auth || (auth.role !== "ADMIN" && auth.role !== "WALI_KELAS")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { kelasId, siswaId } = params;

    const inClass = await prisma.siswaKelas.findFirst({
      where: { kelasTahunAjaranId: kelasId, siswaId },
      select: { id: true },
    });
    if (!inClass) return NextResponse.json({ success: false, message: "Siswa tidak terdaftar di kelas ini" }, { status: 404 });

    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaId },
      select: { id: true, namaDepan: true, namaTengah: true, namaBelakang: true, nis: true, nisn: true },
    });

    const nilai = await prisma.nilai.findMany({
      where: { siswaId },
      select: { id: true, mapel: true, jenis: true, nilai: true, semester: true },
      orderBy: [{ semester: "asc" }, { mapel: "asc" }],
    });

    const total = nilai.length;
    const sum = nilai.reduce((a, n) => a + (n.nilai ?? 0), 0);
    const rata = total ? Math.round((sum / total) * 100) / 100 : null;

    return NextResponse.json({
      success: true,
      data: {
        siswa: {
          ...siswa,
          nama: [siswa?.namaDepan, siswa?.namaTengah, siswa?.namaBelakang].filter(Boolean).join(" "),
        },
        ringkasan: { totalEntri: total, rataRata: rata },
        nilai,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
