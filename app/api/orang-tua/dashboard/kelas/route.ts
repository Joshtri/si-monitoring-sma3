import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser"

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
                                kelasTahunAjaran: {
                                    include: { waliKelas: true }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!orangTua) {
            return NextResponse.json({ message: "Data orang tua tidak ditemukan" }, { status: 404 })
        }

        const data = orangTua.anak.map((anak) => {
            const kelasRelasi = anak.siswaKelas[0]?.kelasTahunAjaran
            return {
                id: anak.id,
                nama: `${anak.namaDepan} ${anak.namaTengah || ""} ${anak.namaBelakang || ""}`.trim(),
                kelas: kelasRelasi?.kelas || "N/A",
                waliKelas: kelasRelasi?.waliKelas
                    ? {
                        nama: kelasRelasi.waliKelas.nama,
                        nip: kelasRelasi.waliKelas.nip
                    }
                    : null
            }
        })

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("Gagal ambil info kelas anak:", error)
        return NextResponse.json({ message: "Server error", error }, { status: 500 })
    }
}
