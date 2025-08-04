import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jadwal = await prisma.jadwalPelajaran.findUnique({
            where: { id: params.id },
            include: {
                kelasTahunAjaran: {
                    select: {
                        id: true,
                        kelas: true,
                    },
                },
                guruMapel: {
                    include: {
                        guru: {
                            select: {
                                id: true,
                                nama: true,
                            },
                        },
                        mataPelajaran: {
                            select: {
                                id: true,
                                nama: true,
                            },
                        },
                    },
                },
            },
        });

        if (!jadwal) {
            return NextResponse.json(
                { message: "Jadwal tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json(jadwal);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil jadwal", error },
            { status: 500 }
        );
    }
}



// PATCH /api/jadwal/:id
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { kelasTahunAjaranId, hari, jamKe, guruMapelId } = body;

        const updated = await prisma.jadwalPelajaran.update({
            where: { id: params.id },
            data: {
                kelasTahunAjaranId,
                hari,
                jamKe,
                guruMapelId,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Gagal memperbarui jadwal", error }, { status: 500 });
    }
}


// DELETE /api/jadwal/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.jadwalPelajaran.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ message: "Gagal menghapus jadwal", error }, { status: 500 });
    }
}
