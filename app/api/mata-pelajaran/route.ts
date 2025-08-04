// POST /api/mata-pelajaran
// GET /api/mata-pelajaran
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nama, aktif = true } = body;

        const newMapel = await prisma.mataPelajaran.create({
            data: { nama, aktif },
        });

        return NextResponse.json(newMapel);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal membuat mata pelajaran", error },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const list = await prisma.mataPelajaran.findMany({
            orderBy: { nama: "asc" },
        });

        return NextResponse.json(list);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil daftar mata pelajaran", error },
            { status: 500 }
        );
    }
}
