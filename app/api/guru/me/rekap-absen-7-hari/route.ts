// File: app/api/guru/me/rekap-absen-7-hari/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

function getLast7Days() {
  const result: { label: string; date: Date }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    result.push({
      date,
      label: date.toLocaleDateString("id-ID", { weekday: "short", day: "2-digit" }),
    });
  }
  return result;
}

export async function GET() {
  try {
    const user = getAuthUserFromCookie();
    if (!user || user.role !== "GURU") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const guru = await prisma.guru.findUnique({
      where: { userId: user.id },
    });

    if (!guru) {
      return NextResponse.json({ message: "Guru tidak ditemukan" }, { status: 404 });
    }

    const days = getLast7Days();
    const result = await Promise.all(
      days.map(async ({ date, label }) => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        const absen = await prisma.absen.findMany({
          where: {
            guruId: guru.id,
            tanggal: {
              gte: date,
              lt: nextDay,
            },
          },
        });

        return {
          label,
          total: absen.length,
          hadir: absen.filter((a) => a.status === "HADIR").length,
          sakit: absen.filter((a) => a.status === "SAKIT").length,
          izin: absen.filter((a) => a.status === "IZIN").length,
          alpha: absen.filter((a) => a.status === "ALPHA").length,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching rekap absen 7 hari:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
