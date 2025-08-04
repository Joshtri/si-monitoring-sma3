// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password"

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                phoneNumber: true,
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan saat mengambil data users" },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest) {
  try {
    const { username, password, email, phoneNumber, role } = await req.json()

    if (!username || !password || !role) {
      return NextResponse.json(
        { message: "Username, password, dan role wajib diisi" },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword, // ✅ SIMPAN HASIL HASH DI SINI
        email,
        phoneNumber,
        role,
      },
    })

    return NextResponse.json({
      message: "User berhasil dibuat",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat user" },
      { status: 500 }
    )
  }
}
