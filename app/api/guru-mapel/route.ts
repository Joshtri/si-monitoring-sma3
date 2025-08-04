// app/api/guru-mapel/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/guru-mapel
export async function GET() {
    try {
        const data = await prisma.guruMapel.findMany({
            include: {
                guru: {
                    select: { id: true, nama: true },
                },
                mataPelajaran: {
                    select: { id: true, nama: true },
                },
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil data guru mapel", error },
            { status: 500 }
        );
    }
}
