import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser"

export async function GET(request: Request) {
    try {
        const user = getAuthUserFromCookie()
        if (!user || user.role !== "ORANG_TUA") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const semester = new URL(request.url).searchParams.get("semester") || "Ganjil"

        const tahunAjaran = await prisma.tahunAjaran.findFirst({
            where: { aktif: true }
        })

        if (!tahunAjaran) {
            return NextResponse.json({ message: "Tahun ajaran aktif tidak ditemukan" }, { status: 404 })
        }

        const orangTua = await prisma.orangTua.findUnique({
            where: { userId: user.id },
            include: {
                anak: {
                    include: {
                        nilai: true,
                        siswaKelas: {
                            where: {
                                kelasTahunAjaran: {
                                    tahunAjaranId: tahunAjaran.id
                                }
                            },
                            include: {
                                kelasTahunAjaran: true
                            }
                        }
                    }
                }
            }
        })

        if (!orangTua) {
            return NextResponse.json({ message: "Data orang tua tidak ditemukan" }, { status: 404 })
        }

        const performers = orangTua.anak.map((anak) => {
            const nilaiSemester = anak.nilai.filter((n) => n.semester === semester)
            const totalNilai = nilaiSemester.reduce((acc, n) => acc + n.nilai, 0)
            const rataRata = nilaiSemester.length > 0 ? totalNilai / nilaiSemester.length : 0
            return {
                id: anak.id,
                nama: `${anak.namaDepan} ${anak.namaTengah || ""} ${anak.namaBelakang || ""}`.trim(),
                kelas: anak.siswaKelas[0]?.kelasTahunAjaran?.kelas || "N/A",
                rataRata: parseFloat(rataRata.toFixed(2))
            }
        })

        const top10 = performers
            .filter((p) => p.rataRata > 0)
            .sort((a, b) => b.rataRata - a.rataRata)
            .slice(0, 10)

        return NextResponse.json({ success: true, data: top10 })
    } catch (error) {
        console.error("Gagal ambil top performers:", error)
        return NextResponse.json({ message: "Server error", error }, { status: 500 })
    }
}
