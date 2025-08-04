// File: app/api/jadwal/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ambil semua jadwal pelajaran
export async function GET() {
  try {
    const data = await prisma.jadwalPelajaran.findMany({
      include: {
        guruMapel: {
          include: {
            guru: true,
            mataPelajaran: true,
          },
        },
        kelasTahunAjaran: {
          include: {
            tahunAjaran: true,
            waliKelas: true,
          },
        },
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data", error }, { status: 500 });
  }
}

// Tambah jadwal pelajaran
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kelasTahunAjaranId, hari, jamKe, guruMapelId } = body;

    if (!kelasTahunAjaranId || !hari || !jamKe || !guruMapelId) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const created = await prisma.jadwalPelajaran.create({
      data: {
        kelasTahunAjaranId,
        hari,
        jamKe,
        guruMapelId,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    return NextResponse.json({ message: "Gagal menambahkan jadwal", error }, { status: 500 });
  }
}
