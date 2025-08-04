// /api/kelas/[id]/assign-siswa/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { siswaIds }: { siswaIds: string[] } = body;

        const data = siswaIds.map((siswaId) => ({
            siswaId,
            kelasTahunAjaranId: params.id,
        }));

        await prisma.siswaKelas.createMany({ data, skipDuplicates: true });

        return NextResponse.json({ message: "Siswa berhasil ditambahkan ke kelas" });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal menambahkan siswa", error },
            { status: 500 }
        );
    }
}
