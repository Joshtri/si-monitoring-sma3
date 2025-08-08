// File: app/api/orang-tua/dashboard/overview/route.ts

import { NextResponse } from "next/server";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const user = await getAuthUserFromCookie();

        if (!user || user.role !== "ORANG_TUA") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const orangTua = await prisma.orangTua.findUnique({
            where: { userId: user.id },
            include: {
                anak: {
                    include: {
                        nilai: true,
                        pelanggaran: true,
                        aktivitas: true,
                        siswaKelas: {
                            include: {
                                absen: true,
                                kelasTahunAjaran: {
                                    include: {
                                        // kelas: true,
                                        tahunAjaran: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });


        if (!orangTua) {
            return NextResponse.json({ success: false, message: "Data orang tua tidak ditemukan" }, { status: 404 });
        }

        const totalAnak = orangTua.anak.length;

        let totalNilai = 0;
        let totalPelanggaran = 0;
        let absensiBulanIni = { HADIR: 0, ALPHA: 0, SAKIT: 0, IZIN: 0 };
        let totalNilaiCount = 0;

        const bulanIni = new Date().getMonth();
        const tahunIni = new Date().getFullYear();

        orangTua.anak.forEach((anak) => {
            // Nilai
            anak.nilai.forEach((n) => {
                totalNilai += n.nilai;
                totalNilaiCount++;
            });

            // Pelanggaran
            totalPelanggaran += anak.pelanggaran.length;

            // Absen bulan ini
            anak.siswaKelas.forEach((sk) => {
                sk.absen.forEach((a) => {
                    const tanggal = new Date(a.tanggal);
                    if (tanggal.getMonth() === bulanIni && tanggal.getFullYear() === tahunIni) {
                        absensiBulanIni[a.status] += 1;
                    }
                });
            });
        });

        const rataRataNilai = totalNilaiCount > 0 ? totalNilai / totalNilaiCount : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalAnak,
                rataRataNilai,
                totalPelanggaran,
                absensiBulanIni,
            },
        });
    } catch (error) {
        console.error("[ORANGTUA_OVERVIEW_ERROR]", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
