import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



// GET /api/kelas/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const kelas = await prisma.kelasTahunAjaran.findUnique({
            where: { id: params.id },
            include: {
                tahunAjaran: true,
                waliKelas: {
                    select: {
                        id: true,
                        nama: true,
                    },
                },
            },
        });

        if (!kelas) {
            return NextResponse.json(
                { message: "Kelas tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json(kelas);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil data kelas", error },
            { status: 500 }
        );
    }
}


// PATCH /api/kelas/:id
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { kelas, waliKelasId } = body;

        const updated = await prisma.kelasTahunAjaran.update({
            where: { id: params.id },
            data: {
                ...(kelas && { kelas }),
                waliKelasId: waliKelasId ?? null,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal memperbarui kelas", error },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.kelasTahunAjaran.delete({ where: { id: params.id } });

        return NextResponse.json({ message: "Kelas berhasil dihapus" });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal menghapus kelas", error },
            { status: 500 }
        );
    }
}
