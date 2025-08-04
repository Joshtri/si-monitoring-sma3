// GET one user, UPDATE, DELETE by ID
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";

function getAuthUser(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = getAuthUser(req);
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const found = await prisma.user.findUnique({
        where: { id: params.id },
        select: { id: true, username: true, email: true, role: true, phoneNumber: true },
    });

    if (!found) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(found);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const user = getAuthUser(req);
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    try {
        const updated = await prisma.user.update({
            where: { id: params.id },
            data,
        });

        return NextResponse.json({ message: "User updated", user: updated });
    } catch (error) {
        return NextResponse.json({ message: "Update failed", error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = getAuthUser(req);
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.user.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "User deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Delete failed", error }, { status: 500 });
    }
}
