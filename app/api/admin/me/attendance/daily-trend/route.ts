// app/api/admin/dashboard/attendance/daily-trend/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/attendance/daily-trend
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const daysParam = searchParams.get('days');
        const days = daysParam ? parseInt(daysParam) : 30;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const dailyAttendance = await prisma.absen.groupBy({
            by: ['tanggal', 'status'],
            where: {
                tanggal: {
                    gte: startDate
                }
            },
            _count: {
                status: true
            },
            orderBy: {
                tanggal: 'asc'
            }
        });

        // Group by date
        const groupedByDate = dailyAttendance.reduce((acc: any, item) => {
            const dateKey = item.tanggal.toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = {
                    date: dateKey,
                    HADIR: 0,
                    SAKIT: 0,
                    IZIN: 0,
                    ALPHA: 0
                };
            }
            acc[dateKey][item.status] = item._count.status;
            return acc;
        }, {});

        const data = Object.values(groupedByDate);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error fetching daily attendance trend:", error);
        return NextResponse.json(
            { message: "Gagal mengambil tren absensi harian", error },
            { status: 500 }
        );
    }
}