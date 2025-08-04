// app/api/guru/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // asumsikan sudah ada
import { z } from "zod";
import { createGuruSchema } from "@/validations/guruSchema"; // asumsi kamu validasi pakai zod


export async function GET() {
    const data = await prisma.guru.findMany({
        include: { user: true, mapel: true, waliKelas: true },
    });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = createGuruSchema.parse(body);

        const { username, password, email, phoneNumber, nama, nip } = data;

        // 1. Buat user terlebih dahulu
        const user = await prisma.user.create({
            data: {
                username,
                password,
                email,
                phoneNumber,
                role: "GURU",
            },
        });

        // 2. Buat guru dengan relasi userId
        const guru = await prisma.guru.create({
            data: {
                nama,
                nip,
                userId: user.id,
            },
        });

        return NextResponse.json({ guru, user }, { status: 201 });
    } catch (err) {
        console.error("Error creating guru:", err);
        return NextResponse.json({ message: "Error", error: err }, { status: 400 });
    }
}