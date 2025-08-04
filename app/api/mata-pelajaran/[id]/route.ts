// GET /api/mata-pelajaran/:id
// PUT /api/mata-pelajaran/:id
// DELETE /api/mata-pelajaran/:id
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const mapel = await prisma.mataPelajaran.findUnique({
            where: { id: params.id },
        });

        if (!mapel) {
            return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(mapel);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil data", error },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const updated = await prisma.mataPelajaran.update({
            where: { id: params.id },
            data: {
                ...(body.nama && { nama: body.nama }),
                ...(typeof body.aktif === "boolean" && { aktif: body.aktif }),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal memperbarui data", error },
            { status: 500 }
        );
    }
}


export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.mataPelajaran.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Berhasil dihapus" });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal menghapus data", error },
            { status: 500 }
        );
    }
}
