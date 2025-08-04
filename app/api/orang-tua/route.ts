import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  const orangTua = await prisma.orangTua.findMany({
    include: { user: true },
  });
  return NextResponse.json(orangTua);
}


export async function POST(req: Request) {
  const body = await req.json();
  const { nama, username, email, phoneNumber, password } = body;

  const newOrangTua = await prisma.orangTua.create({
    data: {
      nama,
      user: {
        create: {
          username,
          email,
          phoneNumber,
          password, // hash kalau perlu
          role: "ORANG_TUA",
        },
      },
    },
    include: { user: true },
  });

  return NextResponse.json(newOrangTua);
}
