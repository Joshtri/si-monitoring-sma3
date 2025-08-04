import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth/password"
import { generateToken } from "@/lib/auth/jwt"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
    }

    const token = generateToken({
      id: user.id,
      sub: user.id,
      username: user.username,
      role: user.role,
    })

    // Set cookie dengan await
    const cookieStore = await cookies()
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 jam
      path: "/",
      sameSite: "lax",
    })

    return NextResponse.json({
      message: "Login berhasil",
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
