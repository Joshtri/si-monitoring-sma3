import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";

export async function GET() {
  const orangTua = await prisma.orangTua.findMany({
    include: { user: true },
  });
  return NextResponse.json(orangTua);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, username, email, phoneNumber, password } = body;

    // ✅ Enkripsi password
    const hashedPassword = await hashPassword(password);

    const newOrangTua = await prisma.orangTua.create({
      data: {
        nama,
        user: {
          create: {
            username,
            email,
            phoneNumber,
            password: hashedPassword, // ✅ simpan versi hashed
            role: "ORANG_TUA",
          },
        },
      },
      include: { user: true },
    });

    return NextResponse.json(newOrangTua, { status: 201 });
  } catch (error) {
    console.error("Error creating orang tua:", error);
    return NextResponse.json(
      { message: "Gagal membuat orang tua", error },
      { status: 400 }
    );
  }
}
