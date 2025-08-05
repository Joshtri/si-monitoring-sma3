// File: /api/guru/absensi/kelas-hari-ini/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

// Fungsi untuk mengambil nama hari saat ini
const getCurrentDayName = (): string => {
    return new Date().toLocaleDateString("id-ID", { weekday: "long" });
};

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

        const today = getCurrentDayName();

        // Ambil jadwal pelajaran guru hari ini
        const jadwalHariIni = await prisma.jadwalPelajaran.findMany({
            where: {
                guruMapel: { guruId: guru.id },
                hari: today,
            },
            include: {
                kelasTahunAjaran: {
                    include: {
                        tahunAjaran: true,
                    },
                },
                guruMapel: {
                    include: {
                        mataPelajaran: true,
                    },
                },
            },
            orderBy: {
                jamKe: "asc",
            },
        });

        // Mapping hasil ke bentuk response
        const result = jadwalHariIni.map((jadwal) => ({
            id: jadwal.kelasTahunAjaran.id,
            
            kelas: jadwal.kelasTahunAjaran.kelas,
            tahunAjaran: jadwal.kelasTahunAjaran.tahunAjaran.tahun,
            jamKe: jadwal.jamKe,
            mapel: jadwal.guruMapel.mataPelajaran.nama,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching kelas hari ini:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
