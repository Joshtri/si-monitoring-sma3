import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/kelas/:id/siswa
export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const siswaKelas = await prisma.siswaKelas.findMany({
            where: {
                kelasTahunAjaranId: params.id,
            },
            include: {
                siswa: {
                    include: {
                        orangTua: {
                            select: {
                                id: true,
                                nama: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                siswa: {
                    namaDepan: "asc",
                },
            },
        });

        // Optional: bisa dirapikan datanya untuk frontend
        const hasil = siswaKelas.map((item) => ({
            id: item.siswa.id,
            nama: [item.siswa.namaDepan, item.siswa.namaTengah, item.siswa.namaBelakang]
                .filter(Boolean)
                .join(" "),
            jenisKelamin: item.siswa.jenisKelamin,
            nis: item.siswa.nis,
            nisn: item.siswa.nisn,
            orangTua: item.siswa.orangTua?.nama ?? "-",
        }));

        return NextResponse.json(hasil);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil siswa dari kelas", error },
            { status: 500 }
        );
    }
}
