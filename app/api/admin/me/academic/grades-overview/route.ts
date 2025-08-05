// app/api/admin/dashboard/academic/grades-overview/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/academic/grades-overview
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const semester = searchParams.get('semester');

        const whereClause = semester ? { semester } : {};

        const [avgGrades, gradeDistribution] = await Promise.all([
            // Rata-rata nilai per mata pelajaran
            prisma.nilai.groupBy({
                by: ['mapel'],
                where: whereClause,
                _avg: {
                    nilai: true
                },
                _count: {
                    nilai: true
                }
            }),

            // Distribusi nilai untuk kategorisasi grade
            prisma.nilai.groupBy({
                by: ['nilai'],
                where: whereClause,
                _count: {
                    nilai: true
                }
            })
        ]);

        // Kategorikan nilai menjadi grade A, B, C, D, E
        const gradeCategories = gradeDistribution.reduce((acc: any, item) => {
            let grade;
            if (item.nilai >= 90) grade = 'A';
            else if (item.nilai >= 80) grade = 'B';
            else if (item.nilai >= 70) grade = 'C';
            else if (item.nilai >= 60) grade = 'D';
            else grade = 'E';

            acc[grade] = (acc[grade] || 0) + item._count.nilai;
            return acc;
        }, { A: 0, B: 0, C: 0, D: 0, E: 0 });

        const avgGradesFormatted = avgGrades
            .map(item => ({
                mataPelajaran: item.mapel,
                rataRata: parseFloat((item._avg.nilai || 0).toFixed(2)),
                jumlahNilai: item._count.nilai
            }))
            .sort((a, b) => b.rataRata - a.rataRata);

        return NextResponse.json({
            success: true,
            data: {
                avgGradesBySubject: avgGradesFormatted,
                gradeDistribution: gradeCategories,
                semester: semester || 'Semua semester'
            }
        });
    } catch (error) {
        console.error("Error fetching grades overview:", error);
        return NextResponse.json(
            { message: "Gagal mengambil overview nilai", error },
            { status: 500 }
        );
    }
}