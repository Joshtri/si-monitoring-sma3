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
                        siswaKelas: {
                            include: {
                                kelasTahunAjaran: {
                                    include: {
                                        tahunAjaran: true,
                                        waliKelas: true,
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

        const data = orangTua.anak.map((anak) => {
            const kelasInfo = anak.siswaKelas.map((sk) => ({
                siswaId: anak.id, // ✅ Diperlukan untuk routing

                nama: anak.namaDepan + (anak.namaBelakang ? ` ${anak.namaBelakang}` : ""),
                kelas: sk.kelasTahunAjaran.kelas,
                tahunAjaran: sk.kelasTahunAjaran.tahunAjaran.tahun,
                waliKelas: sk.kelasTahunAjaran.waliKelas?.nama ?? "Belum Ditentukan",
            }));

            return kelasInfo;
        }).flat();

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("[ORANG_TUA_KELAS_ERROR]", error);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan" }, { status: 500 });
    }
}
