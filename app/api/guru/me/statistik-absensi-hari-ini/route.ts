// File: app/api/guru/me/statistik-absensi-hari-ini/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET() {
    try {
        const user = getAuthUserFromCookie();
        if (!user || user.role !== "GURU") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const guru = await prisma.guru.findUnique({
            where: { userId: user.id },
        });

        if (!guru) {
            return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const absenHariIni = await prisma.absen.findMany({
            where: {
                guruId: guru.id,
                tanggal: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });

        const total = absenHariIni.length;
        const hadir = absenHariIni.filter((a) => a.status === "HADIR").length;
        const sakit = absenHariIni.filter((a) => a.status === "SAKIT").length;
        const izin = absenHariIni.filter((a) => a.status === "IZIN").length;
        const alpha = absenHariIni.filter((a) => a.status === "ALPHA").length;

        return NextResponse.json({ total, hadir, sakit, izin, alpha });
    } catch (error) {
        console.error("Error fetching absensi hari ini:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
