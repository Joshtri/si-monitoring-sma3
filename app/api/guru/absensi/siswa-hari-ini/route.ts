// File: app/api/guru/absensi/siswa-hari-ini/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

const getCurrentDayName = (): string => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const today = new Date();
    return days[today.getDay()];
};

export async function GET(req: Request) {
    try {
        const user = getAuthUserFromCookie();
        if (!user || user.role !== "GURU") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const kelasId = url.searchParams.get("kelasId");

        if (!kelasId) {
            return NextResponse.json({ message: "kelasId diperlukan" }, { status: 400 });
        }

        const guru = await prisma.guru.findUnique({
            where: { userId: user.id },
        });

        if (!guru) {
            return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
        }

        const today = getCurrentDayName();
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0); // Set ke awal hari

        // Cek apakah guru mengajar kelas ini di hari ini
        const jadwal = await prisma.jadwalPelajaran.findFirst({
            where: {
                guruMapel: { guruId: guru.id },
                hari: today,
                kelasTahunAjaranId: kelasId,
            },
            include: {
                guruMapel: {
                    include: {
                        mataPelajaran: true,
                    },
                },
            },
        });

        if (!jadwal) {
            return NextResponse.json({
                message: "Guru tidak mengajar kelas ini hari ini",
                debug: {
                    hari: today,
                    guruId: guru.id,
                    kelasId: kelasId
                }
            }, { status: 403 });
        }

        const kelas = await prisma.kelasTahunAjaran.findUnique({
            where: { id: kelasId },
            include: {
                siswa: {
                    include: {
                        siswa: true,
                        absen: {
                            where: {
                                tanggal: {
                                    gte: todayDate,
                                    lt: new Date(todayDate.getTime() + 24 * 60 * 60 * 1000), // Sampai akhir hari
                                },
                                guruId: guru.id,
                            },
                        },
                    },
                },
            },
        });

        if (!kelas) {
            return NextResponse.json({ message: "Kelas tidak ditemukan" }, { status: 404 });
        }

        const siswaList = kelas.siswa.map((s) => {
            // Cek apakah sudah ada absensi hari ini
            const absenHariIni = s.absen.find(absen => {
                const absenDate = new Date(absen.tanggal);
                return absenDate.toDateString() === todayDate.toDateString();
            });

            return {
                siswaKelasId: s.id,
                siswaId: s.siswa.id,
                nama: `${s.siswa.namaDepan} ${s.siswa.namaTengah ?? ""} ${s.siswa.namaBelakang ?? ""}`.trim(),
                nis: s.siswa.nis ?? "-",
                nisn: s.siswa.nisn ?? "-",
                status: absenHariIni?.status ?? "HADIR", // Default HADIR jika belum ada absensi
                keterangan: absenHariIni?.keterangan ?? null,
                sudahAbsen: !!absenHariIni, // Boolean untuk cek apakah sudah diabsen hari ini
                absenId: absenHariIni?.id ?? null,
            };
        });

        return NextResponse.json({
            siswa: siswaList,
            kelasInfo: {
                kelas: kelas.kelas,
                jadwal: {
                    hari: jadwal.hari,
                    jamKe: jadwal.jamKe,
                    mataPelajaran: jadwal.guruMapel.mataPelajaran.nama,
                },
            },
            tanggal: todayDate.toISOString().split('T')[0],
        });
    } catch (error) {
        console.error("Error fetch siswa absensi per kelas:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}