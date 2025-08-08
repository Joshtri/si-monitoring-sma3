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
                kelasTahunAjaran: true
              }
            },
            nilai: true
          }
        }
      }
    })

    if (!orangTua) {
      return NextResponse.json({ message: "Data orang tua tidak ditemukan" }, { status: 404 })
    }

    const data = orangTua.anak.map((anak) => {
      const kelas = anak.siswaKelas[0]?.kelasTahunAjaran.kelas || "N/A"
      return {
        id: anak.id,
        nama: `${anak.namaDepan} ${anak.namaTengah || ""} ${anak.namaBelakang || ""}`.trim(),
        kelas,
        nilai: anak.nilai.map((n) => ({
          jenis: n.jenis,
          semester: n.semester,
          mapel: n.mapel,
          nilai: n.nilai
        }))
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Gagal ambil riwayat nilai anak:", error)
    return NextResponse.json({ message: "Server error", error }, { status: 500 })
  }
}
