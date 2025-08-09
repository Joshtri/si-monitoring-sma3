import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET() {
  try {
    const auth = await getAuthUserFromCookie();
    if (!auth || !["ADMIN", "WALI_KELAS"].includes(auth.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const ta = await prisma.tahunAjaran.findFirst({ where: { aktif: true } });
    if (!ta) return NextResponse.json({ success: true, data: [] });

    const kelas = await prisma.kelasTahunAjaran.findMany({
      where: { tahunAjaranId: ta.id },
      select: {
        id: true,
        kelas: true,
        waliKelas: { select: { id: true, nama: true } },
        _count: { select: { siswa: true, jadwal: true } },
      },
      orderBy: { kelas: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: kelas.map(k => ({
        id: k.id,
        kelas: k.kelas,
        waliKelas: k.waliKelas,
        totalSiswa: k._count.siswa,
        totalMapelTerjadwal: k._count.jadwal,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
