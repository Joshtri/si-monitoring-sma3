// app/api/admin/dashboard/discipline/violations-summary/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/discipline/violations-summary
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        const startDate = startDateParam
            ? new Date(startDateParam)
            : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = endDateParam ? new Date(endDateParam) : new Date();

        const [violationsByType, topViolators] = await Promise.all([
            // Pelanggaran berdasarkan jenis
            prisma.pelanggaran.groupBy({
                by: ['jenisPelanggaran'],
                where: {
                    tanggal: { gte: startDate, lte: endDate }
                },
                _count: { jenisPelanggaran: true },
                _sum: { poin: true }
            }),

            // Siswa dengan pelanggaran terbanyak
            prisma.siswa.findMany({
                include: {
                    pelanggaran: {
                        where: {
                            tanggal: { gte: startDate, lte: endDate }
                        }
                    },
                    siswaKelas: {
                        include: {
                            kelasTahunAjaran: {
                                select: { kelas: true }
                            }
                        }
                    }
                }
            })
        ]);

        // Format violations by type
        const violationsByTypeFormatted = violationsByType.map(v => ({
            jenis: v.jenisPelanggaran,
            jumlah: v._count.jenisPelanggaran,
            totalPoin: v._sum.poin || 0
        }));

        // Format top violators
        const topViolatorsFormatted = topViolators
            .map(siswa => ({
                id: siswa.id,
                nama: `${siswa.namaDepan} ${siswa.namaTengah || ''} ${siswa.namaBelakang || ''}`.trim(),
                nis: siswa.nis,
                kelas: siswa.siswaKelas[0]?.kelasTahunAjaran?.kelas || 'N/A',
                totalPelanggaran: siswa.pelanggaran.length,
                totalPoin: siswa.pelanggaran.reduce((sum, p) => sum + p.poin, 0)
            }))
            .filter(student => student.totalPelanggaran > 0)
            .sort((a, b) => b.totalPoin - a.totalPoin)
            .slice(0, 10);

        return NextResponse.json({
            success: true,
            data: {
                violationsByType: violationsByTypeFormatted,
                topViolators: topViolatorsFormatted,
                periode: { startDate, endDate }
            }
        });
    } catch (error) {
        console.error("Error fetching violations summary:", error);
        return NextResponse.json(
            { message: "Gagal mengambil ringkasan pelanggaran", error },
            { status: 500 }
        );
    }
}