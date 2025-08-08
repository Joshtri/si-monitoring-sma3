import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { JenisNilai } from "@prisma/client";

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
            nilai: true,
          },
        },
      },
    });

    if (!orangTua) {
      return NextResponse.json({ message: "Orang tua tidak ditemukan" }, { status: 404 });
    }

    const hasil = orangTua.anak.map((anak) => {
      const nilaiByJenis: Record<JenisNilai, number[]> = {
        TUGAS: [],
        ULANGAN: [],
        UTS: [],
        UAS: [],
      };

      anak.nilai.forEach((n) => {
        nilaiByJenis[n.jenis].push(n.nilai);
      });

      const rataRata = {
        TUGAS: nilaiByJenis.TUGAS.length ? avg(nilaiByJenis.TUGAS) : null,
        ULANGAN: nilaiByJenis.ULANGAN.length ? avg(nilaiByJenis.ULANGAN) : null,
        UTS: nilaiByJenis.UTS.length ? avg(nilaiByJenis.UTS) : null,
        UAS: nilaiByJenis.UAS.length ? avg(nilaiByJenis.UAS) : null,
      };

      return {
        id: anak.id,
        nama: `${anak.namaDepan} ${anak.namaTengah ?? ""} ${anak.namaBelakang ?? ""}`.trim(),
        nis: anak.nis ?? "-",
        rataRata,
      };
    });

    return NextResponse.json({ success: true, data: hasil });
  } catch (error) {
    console.error("Gagal ambil nilai rata-rata:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

function avg(arr: number[]): number {
  const total = arr.reduce((a, b) => a + b, 0);
  return Math.round((total / arr.length) * 10) / 10;
}
