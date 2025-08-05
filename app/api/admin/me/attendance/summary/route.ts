// app/api/admin/dashboard/attendance/summary/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/attendance/summary
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        const startDate = startDateParam
            ? new Date(startDateParam)
            : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = endDateParam ? new Date(endDateParam) : new Date();

        const absensiSummary = await prisma.absen.groupBy({
            by: ['status'],
            where: {
                tanggal: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _count: {
                status: true
            }
        });

        const totalAbsensi = absensiSummary.reduce((sum, item) => sum + item._count.status, 0);

        const data = absensiSummary.map(item => ({
            status: item.status,
            jumlah: item._count.status,
            persentase: totalAbsensi > 0 ? parseFloat(((item._count.status / totalAbsensi) * 100).toFixed(2)) : 0
        }));

        return NextResponse.json({
            success: true,
            data: {
                periode: { startDate, endDate },
                summary: data,
                totalAbsensi
            }
        });
    } catch (error) {
        console.error("Error fetching attendance summary:", error);
        return NextResponse.json(
            { message: "Gagal mengambil ringkasan absensi", error },
            { status: 500 }
        );
    }
}