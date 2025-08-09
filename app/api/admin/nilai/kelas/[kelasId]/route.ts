import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import type { JenisNilai } from "@prisma/client";

export async function GET(
    req: NextRequest,
    { params }: { params: { kelasId: string } }
) {
    try {
        const auth = await getAuthUserFromCookie();
        if (!auth || (auth.role !== "ADMIN" && auth.role !== "WALI_KELAS")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { kelasId } = params;

        const kelas = await prisma.kelasTahunAjaran.findUnique({
            where: { id: kelasId },
            select: {
                id: true, kelas: true,
                waliKelas: { select: { id: true, nama: true } },
                tahunAjaran: { select: { id: true, tahun: true, aktif: true } },
            },
        });
        if (!kelas) return NextResponse.json({ success: false, message: "Kelas tidak ditemukan" }, { status: 404 });

        const siswaList = await prisma.siswa.findMany({
            where: { siswaKelas: { some: { kelasTahunAjaranId: kelasId } } },
            select: {
                id: true, namaDepan: true, namaTengah: true, namaBelakang: true, nis: true, nisn: true,
            },
            orderBy: [{ namaDepan: "asc" }, { namaBelakang: "asc" }],
        });

        const students = await Promise.all(siswaList.map(async (s) => {
            const nilai = await prisma.nilai.findMany({
                where: { siswaId: s.id },
                select: { nilai: true, jenis: true, mapel: true, semester: true },
            });

            const byJenis: Record<JenisNilai, { count: number; sum: number }> = {
                TUGAS: { count: 0, sum: 0 },
                ULANGAN: { count: 0, sum: 0 },
                UTS: { count: 0, sum: 0 },
                UAS: { count: 0, sum: 0 },
            } as any;

            let totalCount = 0, totalSum = 0;
            for (const n of nilai) {
                totalCount += 1; totalSum += n.nilai ?? 0;
                (byJenis[n.jenis] ??= { count: 0, sum: 0 });
                byJenis[n.jenis].count += 1;
                byJenis[n.jenis].sum += n.nilai ?? 0;
            }

            const avg = (sum: number, count: number) => (count ? Math.round((sum / count) * 100) / 100 : null);

            const fullName = [s.namaDepan, s.namaTengah, s.namaBelakang].filter(Boolean).join(" ");
            return {
                id: s.id,
                nama: fullName,
                nis: s.nis,
                nisn: s.nisn,
                totalEntri: totalCount,
                ratarata: avg(totalSum, totalCount),
                ratarataPerJenis: {
                    TUGAS: avg(byJenis.TUGAS.sum, byJenis.TUGAS.count),
                    ULANGAN: avg(byJenis.ULANGAN.sum, byJenis.ULANGAN.count),
                    UTS: avg(byJenis.UTS.sum, byJenis.UTS.count),
                    UAS: avg(byJenis.UAS.sum, byJenis.UAS.count),
                },
                hasNilai: totalCount > 0,
            };
        }));

        return NextResponse.json({ success: true, data: { kelas, students } });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
