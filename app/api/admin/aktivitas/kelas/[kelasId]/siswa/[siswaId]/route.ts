import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(
    _req: NextRequest,
    { params }: { params: { kelasId: string; siswaId: string } }
) {
    try {
        const auth = await getAuthUserFromCookie();
        if (!auth || (auth.role !== "ADMIN" && auth.role !== "WALI_KELAS")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { kelasId, siswaId } = params;

        // validasi siswa berada di kelas tsb
        const enrolled = await prisma.siswaKelas.findFirst({
            where: { kelasTahunAjaranId: kelasId, siswaId },
            select: { id: true },
        });
        if (!enrolled) {
            return NextResponse.json(
                { success: false, message: "Siswa tidak terdaftar di kelas ini" },
                { status: 404 }
            );
        }

        const siswa = await prisma.siswa.findUnique({
            where: { id: siswaId },
            select: {
                id: true,
                namaDepan: true,
                namaTengah: true,
                namaBelakang: true,
                nis: true,
                nisn: true,
            },
        });

        const aktivitas = await prisma.aktivitas.findMany({
            where: { siswaId },
            select: {
                id: true,
                namaKegiatan: true,
                jenis: true,
                tanggal: true,
                catatan: true,
            },
            orderBy: { tanggal: "desc" },
        });

        // ringkasan
        const total = aktivitas.length;
        const perJenis = aktivitas.reduce<Record<string, number>>((acc, a) => {
            acc[a.jenis] = (acc[a.jenis] ?? 0) + 1;
            return acc;
        }, {});
        const lastAt = aktivitas[0]?.tanggal ?? null;

        return NextResponse.json({
            success: true,
            data: {
                siswa: {
                    ...siswa,
                    nama: [siswa?.namaDepan, siswa?.namaTengah, siswa?.namaBelakang].filter(Boolean).join(" "),
                },
                ringkasan: {
                    totalAktivitas: total,
                    perJenis,
                    lastActivityAt: lastAt,
                },
                aktivitas,
            },
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
