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

        // pastikan siswa memang di kelas tsb
        const exists = await prisma.siswaKelas.findFirst({
            where: { kelasTahunAjaranId: kelasId, siswaId },
            select: { id: true },
        });
        if (!exists) {
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

        const pelanggaran = await prisma.pelanggaran.findMany({
            where: { siswaId },
            select: {
                id: true,
                jenisPelanggaran: true,
                tanggal: true,
                poin: true,
                tindakan: true,
            },
            orderBy: { tanggal: "desc" },
        });

        const totalPoin = pelanggaran.reduce((acc, p) => acc + (p.poin ?? 0), 0);

        return NextResponse.json({
            success: true,
            data: {
                siswa: {
                    ...siswa,
                    nama: [siswa?.namaDepan, siswa?.namaTengah, siswa?.namaBelakang]
                        .filter(Boolean)
                        .join(" "),
                },
                ringkasan: {
                    totalPelanggaran: pelanggaran.length,
                    totalPoin,
                    lastViolationAt: pelanggaran[0]?.tanggal ?? null,
                },
                pelanggaran,
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
