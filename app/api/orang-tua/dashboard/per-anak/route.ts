import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser"
import { AbsenStatus } from "@prisma/client"

export async function GET() {
    try {
        const user = getAuthUserFromCookie()
        if (!user || user.role !== "ORANG_TUA") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const tahunAktif = await prisma.tahunAjaran.findFirst({
            where: { aktif: true },
        })

        if (!tahunAktif) {
            return NextResponse.json({ message: "Tahun ajaran aktif tidak ditemukan" }, { status: 404 })
        }

        const orangTua = await prisma.orangTua.findUnique({
            where: { userId: user.id },
            include: {
                anak: {
                    include: {
                        siswaKelas: {
                            where: {
                                kelasTahunAjaran: {
                                    tahunAjaranId: tahunAktif.id
                                }
                            },
                            include: {
                                kelasTahunAjaran: true,
                                absen: true,
                            }
                        },
                        nilai: true,
                        pelanggaran: true,
                        aktivitas: true,
                    }
                }
            }
        })

        if (!orangTua) {
            return NextResponse.json({ message: "Data orang tua tidak ditemukan" }, { status: 404 })
        }

        const data = orangTua.anak.map((siswa) => {
            const kelasAktif = siswa.siswaKelas[0]?.kelasTahunAjaran?.kelas ?? "N/A"
            const absenList = siswa.siswaKelas.flatMap(sk => sk.absen)

            const absensiCount = {
                HADIR: 0,
                SAKIT: 0,
                IZIN: 0,
                ALPHA: 0
            }

            absenList.forEach(a => {
                absensiCount[a.status]++
            })

            const totalNilai = siswa.nilai.length
            const rataRataNilai =
                totalNilai > 0 ? Math.round(siswa.nilai.reduce((sum, n) => sum + n.nilai, 0) / totalNilai) : 0

            const totalPelanggaran = siswa.pelanggaran.length
            const totalPoin = siswa.pelanggaran.reduce((sum, p) => sum + p.poin, 0)
            const totalAktivitas = siswa.aktivitas.length

            return {
                id: siswa.id,
                nama: `${siswa.namaDepan} ${siswa.namaTengah || ""} ${siswa.namaBelakang || ""}`.trim(),
                nis: siswa.nis,
                nisn: siswa.nisn,
                jenisKelamin: siswa.jenisKelamin,
                kelas: kelasAktif,
                totalNilai,
                rataRataNilai,
                totalPelanggaran,
                totalPoin,
                absensi: absensiCount,
                totalAktivitas
            }
        })

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("Gagal ambil ringkasan per anak:", error)
        return NextResponse.json({ message: "Server error", error }, { status: 500 })
    }
}
