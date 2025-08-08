import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";


export async function GET() {
  const user = await getAuthUserFromCookie();
  if (!user || user.role !== "GURU") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const guru = await prisma.guru.findUnique({
    where: { userId: user.id },
    include: {
      waliKelas: {
        include: {
          siswa: {
            include: {
              siswa: true,
            },
          },
        },
      },
    },
  });

  if (!guru || guru.waliKelas.length === 0) {
    return NextResponse.json({ success: false, message: "Bukan wali kelas" }, { status: 403 });
  }

  const siswaList = guru.waliKelas.flatMap((kelas) =>
    kelas.siswa.map((sk) => ({
      id: sk.siswa.id,
      nama: sk.siswa.namaDepan + " " + (sk.siswa.namaBelakang || ""),
      kelas: kelas.kelas,
    }))
  );

  return NextResponse.json({ success: true, data: siswaList });
}
