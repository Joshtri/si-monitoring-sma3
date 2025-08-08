import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET() {
    try {
        const user = getAuthUserFromCookie();

        if (!user || user.role !== "ORANG_TUA") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const orangTua = await prisma.orangTua.findUnique({
            where: { userId: user.id },
            include: {
                anak: {
                    include: { pelanggaran: true }
                }
            }
        });

        if (!orangTua) {
            return NextResponse.json({ message: "Orang tua tidak ditemukan" }, { status: 404 });
        }

        let totalPelanggaran = 0;
        let totalPoin = 0;
        const jenisCount: Record<string, number> = {};

        orangTua.anak.forEach((anak) => {
            anak.pelanggaran.forEach((p) => {
                totalPelanggaran += 1;
                totalPoin += p.poin;
                jenisCount[p.jenisPelanggaran] = (jenisCount[p.jenisPelanggaran] || 0) + 1;
            });
        });

        // Cari jenis pelanggaran yang paling sering
        let jenisTerbanyak: string | null = null;
        let maxCount = 0;
        for (const [jenis, count] of Object.entries(jenisCount)) {
            if (count > maxCount) {
                maxCount = count;
                jenisTerbanyak = jenis;
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                totalPelanggaran,
                totalPoin,
                jenisTerbanyak
            }
        });
    } catch (error) {
        console.error("Gagal ambil summary pelanggaran:", error);
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}
