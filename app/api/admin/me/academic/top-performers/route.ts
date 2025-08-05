// app/api/admin/dashboard/academic/top-performers/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/academic/top-performers
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const semester = searchParams.get('semester');

        const limit = limitParam ? parseInt(limitParam) : 10;
        const whereClause = semester ? { semester } : {};

        const topPerformers = await prisma.siswa.findMany({
            include: {
                nilai: {
                    where: whereClause
                },
                siswaKelas: {
                    include: {
                        kelasTahunAjaran: {
                            select: { kelas: true }
                        }
                    }
                }
            }
        });

        const studentsWithAvg = topPerformers
            .map(siswa => {
                const totalNilai = siswa.nilai.reduce((sum, n) => sum + n.nilai, 0);
                const avgNilai = siswa.nilai.length > 0 ? totalNilai / siswa.nilai.length : 0;

                return {
                    id: siswa.id,
                    nama: `${siswa.namaDepan} ${siswa.namaTengah || ''} ${siswa.namaBelakang || ''}`.trim(),
                    nis: siswa.nis,
                    kelas: siswa.siswaKelas[0]?.kelasTahunAjaran?.kelas || 'N/A',
                    rataRataNilai: parseFloat(avgNilai.toFixed(2)),
                    jumlahNilai: siswa.nilai.length
                };
            })
            .filter(student => student.jumlahNilai > 0)
            .sort((a, b) => b.rataRataNilai - a.rataRataNilai)
            .slice(0, limit);

        return NextResponse.json({
            success: true,
            data: studentsWithAvg
        });
    } catch (error) {
        console.error("Error fetching top performers:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data siswa berprestasi", error },
            { status: 500 }
        );
    }
}