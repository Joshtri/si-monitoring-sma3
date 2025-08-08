import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { AbsenStatus } from "@prisma/client";

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
          include: {
            siswaKelas: {
              include: {
                absen: {
                  where: {
                    tanggal: {
                      gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // awal bulan
                      lte: new Date(), // hari ini
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orangTua) {
      return NextResponse.json({ message: "Orang tua tidak ditemukan" }, { status: 404 });
    }

    const hasil = orangTua.anak.map((anak) => {
      const absensi = {
        HADIR: 0,
        SAKIT: 0,
        IZIN: 0,
        ALPHA: 0,
      };

      anak.siswaKelas.forEach((sk) => {
        sk.absen.forEach((a) => {
          absensi[a.status]++;
        });
      });

      return {
        id: anak.id,
        nama: `${anak.namaDepan} ${anak.namaTengah ?? ""} ${anak.namaBelakang ?? ""}`.trim(),
        nis: anak.nis ?? "-",
        absensi,
      };
    });

    return NextResponse.json({ success: true, data: hasil });
  } catch (error) {
    console.error("Gagal ambil ringkasan absensi:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
