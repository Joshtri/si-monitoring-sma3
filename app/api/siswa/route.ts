import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allSiswa = await prisma.siswa.findMany({
            include: {
                orangTua: {
                    select: {
                        id: true,
                        nama: true,
                    },
                },
                siswaKelas: {
                    include: {
                        kelasTahunAjaran: {
                            include: {
                                tahunAjaran: true,
                                waliKelas: {
                                    select: {
                                        id: true,
                                        nama: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                namaDepan: "asc",
            },
        });

        return NextResponse.json(allSiswa);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil data siswa", error },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const siswa = await prisma.siswa.create({
            data: {
                namaDepan: body.namaDepan,
                namaTengah: body.namaTengah,
                namaBelakang: body.namaBelakang,
                nisn: body.nisn,
                nis: body.nis,
                jenisKelamin: body.jenisKelamin,
                alamat: body.alamat,
                orangTua: { connect: { id: body.orangTuaId } },
            },
        });

        return NextResponse.json(siswa, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Gagal membuat siswa", error }, { status: 500 });
    }
}