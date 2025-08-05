import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { AbsenStatus } from "@prisma/client";
import { z } from "zod";

const getTodayName = (): string =>
    new Date().toLocaleDateString("id-ID", { weekday: "long" });

export async function GET() {
    try {
        const user = getAuthUserFromCookie();
        if (!user || user.role !== "GURU") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const guru = await prisma.guru.findUnique({
            where: { userId: user.id },
        });
        if (!guru) {
            return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
        }

        const hari = getTodayName();
        const jadwal = await prisma.jadwalPelajaran.findMany({
            where: {
                guruMapel: { guruId: guru.id },
                hari,
            },
            include: {
                kelasTahunAjaran: {
                    include: {
                        siswa: {
                            include: {
                                siswa: true,
                            },
                        },
                    },
                },
                guruMapel: {
                    include: { mataPelajaran: true },
                },
            },
        });

        const hasil = jadwal.map((j) => ({
            kelasTahunAjaranId: j.kelasTahunAjaranId,
            mataPelajaran: j.guruMapel.mataPelajaran.nama,
            jamKe: j.jamKe,
            siswa: j.kelasTahunAjaran.siswa.map((sk) => ({
                siswaKelasId: sk.id,
                nama: `${sk.siswa.namaDepan} ${sk.siswa.namaBelakang ?? ""}`.trim(),
                nis: sk.siswa.nis,
            })),
        }));

        return NextResponse.json(hasil);
    } catch (err) {
        console.error("Error ambil siswa absen:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}


const AbsenInputSchema = z.array(z.object({
  siswaKelasId: z.string().min(1),
  status: z.nativeEnum(AbsenStatus),
  keterangan: z.string().optional(),
}));

export async function POST(req: Request) {
  try {
    const user = getAuthUserFromCookie();
    if (!user || user.role !== "GURU") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const guru = await prisma.guru.findUnique({
      where: { userId: user.id },
    });
    if (!guru) {
      return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
    }

    const body = await req.json();
    const absensi = AbsenInputSchema.parse(body);

    const tanggalHariIni = new Date();
    tanggalHariIni.setHours(0, 0, 0, 0);

    // Hapus absensi lama untuk siswa-siswa ini (prevent duplicate)
    const siswaKelasIds = absensi.map((item) => item.siswaKelasId);
    await prisma.absen.deleteMany({
      where: {
        siswaKelasId: { in: siswaKelasIds },
        tanggal: tanggalHariIni,
      },
    });

    // Simpan absensi baru
    const hasil = await prisma.absen.createMany({
      data: absensi.map((item) => ({
        siswaKelasId: item.siswaKelasId,
        status: item.status,
        keterangan: item.keterangan,
        guruId: guru.id,
        tanggal: tanggalHariIni,
      })),
    });

    return NextResponse.json({ success: true, count: hasil.count });
  } catch (error) {
    console.error("Gagal simpan absensi:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
