import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(
    req: Request,
    { params }: { params: { siswaId: string } }
) {
    try {
        const user = await getAuthUserFromCookie();

        if (!user || user.role !== "ORANG_TUA") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const siswa = await prisma.siswa.findUnique({
            where: { id: params.siswaId },
            include: {
                siswaKelas: {
                    where: {
                        kelasTahunAjaran: {
                            tahunAjaran: { aktif: true },
                        },
                    },
                    include: {
                        kelasTahunAjaran: {
                            include: {
                                jadwal: {
                                    include: {
                                        guruMapel: {
                                            include: {
                                                guru: true,
                                                mataPelajaran: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!siswa) {
            return NextResponse.json({ success: false, message: "Siswa tidak ditemukan" }, { status: 404 });
        }

        const jadwal = siswa.siswaKelas?.[0]?.kelasTahunAjaran?.jadwal.map((j) => ({
            hari: j.hari,
            jamKe: j.jamKe,
            mapel: j.guruMapel.mataPelajaran.nama,
            guru: j.guruMapel.guru.nama,
        })) ?? [];

        return NextResponse.json({ success: true, data: jadwal });
    } catch (error) {
        console.error("[ORANG_TUA_JADWAL_ERROR]", error);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan" }, { status: 500 });
    }
}
