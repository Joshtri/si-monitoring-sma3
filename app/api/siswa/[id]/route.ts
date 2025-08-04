import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const siswa = await prisma.siswa.findUnique({
            where: { id: params.id },
            include: {
                orangTua: true,
                siswaKelas: {
                    include: {
                        kelasTahunAjaran: {
                            include: {
                                tahunAjaran: true,
                                waliKelas: true,
                            },
                        },
                        absen: true,
                    },
                },
                nilai: true,
                pelanggaran: true,
                aktivitas: true,
            },
        });

        if (!siswa) {
            return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(siswa);
    } catch (error) {
        return NextResponse.json({ message: "Terjadi kesalahan", error }, { status: 500 });
    }
}



export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();

        const updated = await prisma.siswa.update({
            where: { id: params.id },
            data: {
                namaDepan: body.namaDepan,
                namaTengah: body.namaTengah,
                namaBelakang: body.namaBelakang,
                nisn: body.nisn,
                nis: body.nis,
                jenisKelamin: body.jenisKelamin,
                alamat: body.alamat,
                orangTuaId: body.orangTuaId,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Gagal memperbarui siswa", error }, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.siswa.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Siswa berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ message: "Gagal menghapus siswa", error }, { status: 500 });
    }
}
