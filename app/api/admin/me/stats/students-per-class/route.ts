// app/api/admin/dashboard/stats/students-per-class/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/stats/students-per-class
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

        const siswaPerKelas = await prisma.kelasTahunAjaran.findMany({
            where: { tahunAjaranId: tahunAjaranAktif.id },
            include: {
                _count: {
                    select: { siswa: true }
                }
            },
            orderBy: { kelas: 'asc' }
        });

        const data = siswaPerKelas.map(kelas => ({
            kelas: kelas.kelas,
            jumlahSiswa: kelas._count.siswa
        }));

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error fetching students per class:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data siswa per kelas", error },
            { status: 500 }
        );
    }
}