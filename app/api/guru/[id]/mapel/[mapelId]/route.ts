// DELETE /api/guru/:id/mapel/:mapelId
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string; mapelId: string } }
) {
    const { id, mapelId } = params;

    try {
        const deleted = await prisma.guruMapel.deleteMany({
            where: {
                guruId: id,
                mataPelajaranId: mapelId,
            },
        });

        if (deleted.count === 0) {
            return NextResponse.json(
                { message: "Data tidak ditemukan atau sudah dihapus." },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Mapel berhasil dihapus dari guru." });
    } catch (error) {
        return NextResponse.json(
            { message: "Terjadi kesalahan saat menghapus mapel dari guru.", error },
            { status: 500 }
        );
    }
}