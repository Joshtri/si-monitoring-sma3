import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const tahunAjaran = await prisma.tahunAjaran.findUnique({
            where: { id: params.id },
        });

        if (!tahunAjaran) {
            return NextResponse.json({ message: "Tahun ajaran tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(tahunAjaran);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil data tahun ajaran", error },
            { status: 500 }
        );
    }
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { tahun, aktif } = body;

        // Jika aktif = true, nonaktifkan semua dulu
        if (aktif === true) {
            await prisma.tahunAjaran.updateMany({
                data: { aktif: false },
            });
        }

        const updated = await prisma.tahunAjaran.update({
            where: { id: params.id },
            data: {
                tahun,
                ...(aktif !== undefined && { aktif }), // hanya update jika aktif disertakan
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Gagal memperbarui tahun ajaran", error }, { status: 500 });
    }
}

// DELETE /api/tahun-ajaran/:id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.tahunAjaran.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Tahun ajaran berhasil dihapus" });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal menghapus tahun ajaran", error },
            { status: 500 }
        );
    }
}