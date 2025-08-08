import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(req: NextRequest) {
  // 1) Auth & role check
  const user = await getAuthUserFromCookie();
  if (!user || user.role !== "GURU") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2) Ambil guru beserta kelas wali & siswa2nya
  const guru = await prisma.guru.findUnique({
    where: { userId: user.id },
    include: {
      waliKelas: {
        include: {
          siswa: { // SiswaKelas[]
            include: {
              siswa: true, // ambil entity Siswa
            },
          },
        },
      },
    },
  });

  // 3) Validasi: harus wali kelas
  if (!guru?.waliKelas || guru.waliKelas.length === 0) {
    return NextResponse.json({ message: "Anda bukan wali kelas" }, { status: 403 });
  }

  // NOTE: kalau 1 guru bisa punya >1 kelas wali, ambil yang pertama dulu
  // Bisa ditambah query ?kelasId=... kalau butuh spesifik.
  const kelas = guru.waliKelas[0];

  // 4) Map ke bentuk {id, nama}
  const siswaList = kelas.siswa.map((sk) => ({
    id: sk.siswa.id,
    nama: [sk.siswa.namaDepan, sk.siswa.namaTengah, sk.siswa.namaBelakang]
      .filter(Boolean)
      .join(" "),
  }));

  return NextResponse.json({
    success: true,
    data: siswaList,
  });
}
