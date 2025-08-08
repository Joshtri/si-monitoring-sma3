import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser"


type AbsensiTanggal = {
    tanggal: string // ISO Date string
    anak: {
        id: string
        nama: string
        kelas: string
        status: "HADIR" | "SAKIT" | "IZIN" | "ALPHA"
        keterangan?: string
    }[]
}


export async function GET() {
    try {
        const user = getAuthUserFromCookie()
        if (!user || user.role !== "ORANG_TUA") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const tahunAktif = await prisma.tahunAjaran.findFirst({
            where: { aktif: true }
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
                                absen: true
                            }
                        }
                    }
                }
            }
        })

        if (!orangTua) {
            return NextResponse.json({ message: "Data orang tua tidak ditemukan" }, { status: 404 })
        }

        const absensiMap: Record<string, AbsensiTanggal["anak"]> = {}

        orangTua.anak.forEach((anak) => {
            anak.siswaKelas.forEach((sk) => {
                sk.absen.forEach((absen) => {
                    const tanggalKey = absen.tanggal.toISOString().split("T")[0]

                    if (!absensiMap[tanggalKey]) {
                        absensiMap[tanggalKey] = []
                    }

                    absensiMap[tanggalKey].push({
                        id: anak.id,
                        nama: `${anak.namaDepan} ${anak.namaTengah || ""} ${anak.namaBelakang || ""}`.trim(),
                        kelas: sk.kelasTahunAjaran.kelas,
                        status: absen.status,
                        keterangan: absen.keterangan || undefined
                    })
                })
            })
        })

        const data = Object.entries(absensiMap)
            .map(([tanggal, anak]) => ({
                tanggal,
                anak
            }))
            .sort((a, b) => b.tanggal.localeCompare(a.tanggal)) // sort by newest first

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("Gagal ambil riwayat absensi anak:", error)
        return NextResponse.json({ message: "Server error", error }, { status: 500 })
    }
}
