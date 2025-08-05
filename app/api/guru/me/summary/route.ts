// File: app/api/guru/me/summary/route.ts
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
            include: {
                mapel: true, // GuruMapel[]
                waliKelas: true, // KelasTahunAjaran[]
            },
        });

        if (!guru) {
            return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
        }

        // Total mapel diampu
        const totalMapel = guru.mapel.length;

        // Kelas yang diajar (dari jadwal pelajaran melalui GuruMapel)
        const jadwal = await prisma.jadwalPelajaran.findMany({
            where: { guruMapel: { guruId: guru.id } },
            include: { kelasTahunAjaran: true },
        });

        const kelasUnik = new Set(jadwal.map((j) => j.kelasTahunAjaranId));

        return NextResponse.json({
            totalMapel,
            totalKelas: kelasUnik.size,
        });
    } catch (error) {
        console.error("Error fetching guru summary:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
