// app/api/admin/dashboard/stats/overview/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/stats/overview
export async function GET() {
    try {
        const tahunAjaranAktif = await prisma.tahunAjaran.findFirst({
            where: { aktif: true }
        });

        if (!tahunAjaranAktif) {
            return NextResponse.json(
                { message: "Tidak ada tahun ajaran aktif" },
                { status: 404 }
            );
        }

        const [totalSiswa, totalGuru, totalKelas, totalMapel] = await Promise.all([
            // Total siswa aktif (yang terdaftar di tahun ajaran aktif)
            prisma.siswa.count({
                where: {
                    siswaKelas: {
                        some: {
                            kelasTahunAjaran: {
                                tahunAjaranId: tahunAjaranAktif.id
                            }
                        }
                    }
                }
            }),

            // Total guru
            prisma.guru.count(),

            // Total kelas di tahun ajaran aktif
            prisma.kelasTahunAjaran.count({
                where: { tahunAjaranId: tahunAjaranAktif.id }
            }),

            // Total mata pelajaran aktif
            prisma.mataPelajaran.count({
                where: { aktif: true }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalSiswa,
                totalGuru,
                totalKelas,
                totalMapel,
                tahunAjaranAktif: tahunAjaranAktif.tahun
            }
        });
    } catch (error) {
        console.error("Error fetching overview stats:", error);
        return NextResponse.json(
            { message: "Gagal mengambil statistik overview", error },
            { status: 500 }
        );
    }
}