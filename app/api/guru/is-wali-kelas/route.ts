import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET() {
    const user = await getAuthUserFromCookie();
    if (!user || user.role !== "GURU") {
        return NextResponse.json({ isWaliKelas: false }, { status: 403 });
    }

    const guru = await prisma.guru.findUnique({
        where: { userId: user.id },
        include: { waliKelas: true },
    });

    const isWaliKelas = guru?.waliKelas?.length > 0;

    return NextResponse.json({ isWaliKelas });
}
