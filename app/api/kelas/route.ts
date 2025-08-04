import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/kelas → kelas dari tahun ajaran yang aktif
export async function GET() {
  try {
    const kelas = await prisma.kelasTahunAjaran.findMany({
      where: {
        tahunAjaran: {
          aktif: true,
        },
      },
      include: {
        tahunAjaran: true,
        waliKelas: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      orderBy: { kelas: "asc" },
    });

    return NextResponse.json(kelas);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data kelas", error }, { status: 500 });
  }
}

// POST /api/kelas
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kelas, tahunAjaranId, waliKelasId } = body;

    if (!kelas || !tahunAjaranId) {
      return NextResponse.json({ message: "Kelas dan Tahun Ajaran wajib diisi" }, { status: 400 });
    }

    const created = await prisma.kelasTahunAjaran.create({
      data: {
        kelas,
        tahunAjaranId,
        waliKelasId: waliKelasId ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menambahkan kelas", error }, { status: 500 });
  }
}
