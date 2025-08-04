import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/tahun-ajaran
export async function GET() {
    try {
        const data = await prisma.tahunAjaran.findMany({
            orderBy: { tahun: "desc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: "Gagal mengambil tahun ajaran", error }, { status: 500 });
    }
}

// POST /api/tahun-ajaran
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tahun, aktif } = body;

        if (!tahun || typeof tahun !== "string") {
            return NextResponse.json({ message: "Tahun wajib diisi (string)" }, { status: 400 });
        }

        const match = tahun.match(/^(\d{4})\/(\d{4})$/);
        if (!match) {
            return NextResponse.json({ message: "Format tahun tidak valid (contoh: 2025/2026)" }, { status: 400 });
        }

        const startYear = parseInt(match[1]);
        const endYear = parseInt(match[2]);

        const mulaiGanjil = new Date(`${startYear}-07-01`);
        const selesaiGenap = new Date(`${endYear}-06-30`);

        const created = await prisma.tahunAjaran.create({
            data: {
                tahun,
                aktif: aktif ?? false,
                mulaiGanjil,
                selesaiGenap,
            },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("Gagal tambah tahun ajaran:", error);
        return NextResponse.json({ message: "Gagal menambahkan tahun ajaran", error }, { status: 500 });
    }
}
