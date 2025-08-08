import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { mapelId: string } } // ambil dari URL
) {
  const user = await getAuthUserFromCookie();
  if (!user || user.role !== "GURU") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const guru = await prisma.guru.findUnique({
    where: { userId: user.id },
    include: {
      waliKelas: {
        include: {
          tahunAjaran: true,
          siswa: {
            include: { siswa: true },
          },
          jadwal: {
            include: {
              guruMapel: {
                include: { mataPelajaran: true },
              },
            },
          },
        },
      },
    },
  });

  if (!guru?.waliKelas || guru.waliKelas.length === 0) {
    return NextResponse.json(
      { message: "Anda bukan wali kelas" },
      { status: 403 }
    );
  }

  const kelas = guru.waliKelas[0];

  // Cari jadwal dengan mapelId dari params
  const jadwalMapel = kelas.jadwal.find(
    (j) => j.guruMapel.mataPelajaran.id === params.mapelId
  );

  if (!jadwalMapel) {
    return NextResponse.json(
      { message: "Mata pelajaran tidak ditemukan di kelas ini" },
      { status: 404 }
    );
  }

  const siswaList = kelas.siswa.map((sk) => ({
    id: sk.siswa.id,
    nama: [sk.siswa.namaDepan, sk.siswa.namaTengah, sk.siswa.namaBelakang]
      .filter(Boolean)
      .join(" "),
  }));

  return NextResponse.json({
    success: true,
    data: {
      kelas: kelas.kelas,
      tahunAjaran: kelas.tahunAjaran.tahun,
      mataPelajaran: jadwalMapel.guruMapel.mataPelajaran.nama,
      siswa: siswaList,
    },
  });
}
