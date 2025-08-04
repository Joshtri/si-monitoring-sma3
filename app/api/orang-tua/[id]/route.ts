// app/api/orang-tua/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    const data = await prisma.orangTua.findUnique({
        where: { id },
        include: {
            user: true,
            anak: true,
        },
    });

    if (!data) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}



export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id; // ✅ Ini boleh, karena kita destructuring setelah await context
    const body = await req.json();
    const { nama, user } = body;

    if (!user?.id || !user?.username || !user?.email) {
        return NextResponse.json(
            { message: "Data user tidak lengkap atau tidak ditemukan." },
            { status: 400 }
        );
    }

    try {
        const updated = await prisma.orangTua.update({
            where: { id },
            data: {
                nama,
                user: {
                    update: {
                        where: { id: user.id },
                        data: {
                            username: user.username,
                            email: user.email,
                            phoneNumber: user.phoneNumber || null,
                        },
                    },
                },
            },
            include: { user: true },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[ORANG_TUA_UPDATE_ERROR]", error);
        return NextResponse.json(
            { message: "Gagal memperbarui data orang tua." },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const deleted = await prisma.orangTua.delete({
        where: { id: params.id },
    });

    return NextResponse.json(deleted);
}
