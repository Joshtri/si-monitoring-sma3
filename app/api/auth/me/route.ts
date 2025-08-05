import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ message: "Token tidak ditemukan" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Token tidak valid" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        guru: {
          select: {
            id: true,
            nama: true,
            nip: true,
            waliKelas: {
              select: {
                id: true,
                kelas: true,
                tahunAjaran: {
                  select: {
                    tahun: true,
                    aktif: true,
                  },
                },
              },
            },
            mapel: {
              include: {
                mataPelajaran: true,
              },
            },
          },
        },
        orangTua: {
          select: {
            id: true,
            nama: true,
            anak: {
              select: {
                id: true,
                namaDepan: true,
                namaBelakang: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
