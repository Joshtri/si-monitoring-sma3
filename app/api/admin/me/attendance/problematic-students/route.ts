// app/api/admin/dashboard/attendance/problematic-students/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/attendance/problematic-students
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : 10;

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const problematicStudents = await prisma.siswa.findMany({
            include: {
                siswaKelas: {
                    include: {
                        absen: {
                            where: {
                                tanggal: { gte: startOfMonth },
                                status: { in: ['ALPHA', 'SAKIT', 'IZIN'] }
                            }
                        },
                        kelasTahunAjaran: {
                            select: { kelas: true }
                        }
                    }
                }
            }
        });

        const studentsWithAbsenceCount = problematicStudents
            .map(siswa => {
                const totalAbsensi = siswa.siswaKelas.reduce((sum, sk) => sum + sk.absen.length, 0);
                const kelas = siswa.siswaKelas[0]?.kelasTahunAjaran?.kelas || 'N/A';

                // Breakdown absensi berdasarkan status
                const breakdown = siswa.siswaKelas[0]?.absen.reduce((acc: any, absen) => {
                    acc[absen.status] = (acc[absen.status] || 0) + 1;
                    return acc;
                }, { ALPHA: 0, SAKIT: 0, IZIN: 0 }) || { ALPHA: 0, SAKIT: 0, IZIN: 0 };

                return {
                    id: siswa.id,
                    nama: `${siswa.namaDepan} ${siswa.namaTengah || ''} ${siswa.namaBelakang || ''}`.trim(),
                    nis: siswa.nis,
                    kelas,
                    totalAbsensi,
                    breakdown
                };
            })
            .filter(student => student.totalAbsensi > 0)
            .sort((a, b) => b.totalAbsensi - a.totalAbsensi)
            .slice(0, limit);

        return NextResponse.json({
            success: true,
            data: studentsWithAbsenceCount
        });
    } catch (error) {
        console.error("Error fetching problematic students:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data siswa bermasalah", error },
            { status: 500 }
        );
    }
}