import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { kelasId: string } }
) {
    const user = await getAuthUserFromCookie();

    if (!user || user.role !== "GURU") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const guru = await prisma.guru.findUnique({
        where: { userId: user.id },
    });

    if (!guru) {
        return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
    }

    const { kelasId } = params;

    // Ambil semua absensi berdasarkan kelas (SiswaKelas) dan guru yang sedang login
    const siswaKelas = await prisma.siswaKelas.findMany({
        where: {
            kelasTahunAjaranId: kelasId,
        },
        include: {
            siswa: true,
            absen: {
                where: { guruId: guru.id },
                orderBy: { tanggal: "desc" },
            },
        },
    });

    // Kelompokkan absensi berdasarkan tanggal
    const data: Record<string, any[]> = {};
    for (const sk of siswaKelas) {
        for (const absen of sk.absen) {
            const tanggalKey = absen.tanggal.toISOString().split("T")[0];
            if (!data[tanggalKey]) data[tanggalKey] = [];

            data[tanggalKey].push({
                nama: sk.siswa.namaDepan + (sk.siswa.namaBelakang ? " " + sk.siswa.namaBelakang : ""),
                nis: sk.siswa.nis,
                status: absen.status,
                keterangan: absen.keterangan,
            });
        }
    }

    return NextResponse.json(data);
}
