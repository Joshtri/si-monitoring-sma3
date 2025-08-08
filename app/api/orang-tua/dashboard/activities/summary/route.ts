import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { JenisAktivitas } from "@prisma/client";

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
                    include: { aktivitas: true }
                }
            }
        });

        if (!orangTua) {
            return NextResponse.json({ message: "Orang tua tidak ditemukan" }, { status: 404 });
        }

        let ekskul = 0;
        let organisasi = 0;
        let lomba = 0;

        orangTua.anak.forEach((anak) => {
            anak.aktivitas.forEach((a) => {
                if (a.jenis === JenisAktivitas.EKSTRAKURIKULER) ekskul++;
                else if (a.jenis === JenisAktivitas.ORGANISASI) organisasi++;
                else if (a.jenis === JenisAktivitas.LOMBA) lomba++;
            });
        });

        return NextResponse.json({
            success: true,
            data: {
                ekskul,
                organisasi,
                lomba
            }
        });
    } catch (error) {
        console.error("Gagal ambil ringkasan aktivitas:", error);
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}
