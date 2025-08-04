// app/api/guru/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { updateGuruSchema } from "@/validations/guruSchema";


export async function GET(_: Request, { params }: { params: { id: string } }) {
    const guru = await prisma.guru.findUnique({
        where: { id: params.id },
        include: { user: true, mapel: true },
    });

    if (!guru) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(guru);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = updateGuruSchema.parse(body);

    const updated = await prisma.guru.update({
      where: { id: params.id },
      data: {
        nama: data.nama,
        nip: data.nip,
        user: {
          update: {
            username: data.user.username,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber,
          },
        },
      },
      include: {
        user: true, // supaya response lengkap
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH error", error);
    return NextResponse.json(
      { message: "Failed to update guru", error },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await prisma.guru.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted" });
}
