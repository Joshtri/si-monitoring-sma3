import { NextResponse } from "next/server";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthUserFromCookie();

  if (!user || user.role !== "GURU") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const guru = await prisma.guru.findUnique({
    where: { userId: user.id },
    include: {
      waliKelas: {
        where: {
          tahunAjaran: {
            aktif: true,
          },
        },
        include: {
          jadwal: {
            include: {
              guruMapel: {
                include: {
                  mataPelajaran: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const kelasDiAsuh = guru?.waliKelas?.[0];

  if (!kelasDiAsuh) {
    return NextResponse.json(
      { message: "Anda bukan wali kelas aktif." },
      { status: 403 }
    );
  }

  // Ambil semua mata pelajaran unik dari jadwal
  const mapelList = kelasDiAsuh.jadwal
    .map((jadwal) => jadwal.guruMapel?.mataPelajaran)
    .filter(Boolean)
    .reduce((acc: any[], mapel) => {
      if (!acc.some((m) => m.id === mapel.id)) acc.push(mapel);
      return acc;
    }, []);

  return NextResponse.json({
    success: true,
    data: mapelList,
    kelas: {
      id: kelasDiAsuh.id,
      nama: kelasDiAsuh.kelas,
    },
  });
}
