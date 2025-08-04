// /api/guru/[id]/mapel/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/guru/:id/mapel
export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const mapel = await prisma.guruMapel.findMany({
            where: { guruId: params.id },
            include: {
                mataPelajaran: true,
            },
        });

        const result = mapel.map((item) => ({
            id: item.mataPelajaran.id,
            nama: item.mataPelajaran.nama,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("GET guru mapel error:", error);
        return NextResponse.json({ message: "Gagal mengambil mapel", error }, { status: 500 });
    }
}

// POST /api/guru/:id/mapel
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { mataPelajaranId } = body;

        if (!mataPelajaranId || mataPelajaranId.trim() === "") {
            return NextResponse.json({ message: "Mata pelajaran wajib diisi" }, { status: 400 });
        }

        const created = await prisma.guruMapel.create({
            data: {
                guru: { connect: { id: params.id } },
                mataPelajaran: { connect: { id: mataPelajaranId } },
            },
        });

        return NextResponse.json(created);
    } catch (error) {
        console.error("Gagal assign mapel:", error);
        return NextResponse.json({ message: "Gagal menambahkan mapel", error }, { status: 500 });
    }
}
