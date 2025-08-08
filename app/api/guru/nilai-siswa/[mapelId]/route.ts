import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { mapelId: string } }
) {
  const user = await getAuthUserFromCookie();
  if (!user || user.role !== "GURU") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ambil guru dan kelas yang diasuh
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

  // Cari mapel sesuai mapelId
  const jadwalMapel = kelas.jadwal.find(
    (j) => j.guruMapel.mataPelajaran.id === params.mapelId
  );

  if (!jadwalMapel) {
    return NextResponse.json(
      { message: "Mata pelajaran tidak ditemukan di kelas ini" },
      { status: 404 }
    );
  }

  // Daftar siswa
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


export async function POST(
  req: NextRequest,
  { params }: { params: { mapelId: string } }
) {
  const user = await getAuthUserFromCookie();
  if (!user || user.role !== "GURU") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { mapelId } = params;
  const body = await req.json();

  const { nilai, jenis, semester } = body;
  if (!nilai || typeof nilai !== "object") {
    return NextResponse.json({ message: "Data nilai tidak valid" }, { status: 400 });
  }
  if (!jenis || !semester) {
    return NextResponse.json({ message: "Jenis nilai dan semester wajib diisi" }, { status: 400 });
  }

  // Ambil guru + wali kelas untuk validasi
  const guru = await prisma.guru.findUnique({
    where: { userId: user.id },
    include: {
      waliKelas: {
        include: {
          jadwal: {
            include: {
              guruMapel: true,
            },
          },
          siswa: {
            include: { siswa: true },
          },
        },
      },
    },
  });

  if (!guru?.waliKelas || guru.waliKelas.length === 0) {
    return NextResponse.json({ message: "Anda bukan wali kelas" }, { status: 403 });
  }

  const kelas = guru.waliKelas[0];

  // Validasi mapel ada di kelas ini
  const jadwalMapel = kelas.jadwal.find(
    (j) => j.guruMapel.mataPelajaranId === mapelId
  );
  if (!jadwalMapel) {
    return NextResponse.json(
      { message: "Mata pelajaran tidak ditemukan di kelas ini" },
      { status: 404 }
    );
  }

  // Simpan nilai
  const createData = Object.entries(nilai).map(([siswaId, skor]) => ({
    siswaId,
    mapel: jadwalMapel.guruMapel.mataPelajaranId,
    jenis,
    nilai: Number(skor),
    semester,
  }));

  await prisma.nilai.createMany({
    data: createData,
  });

  return NextResponse.json({ success: true, message: "Nilai berhasil disimpan" });
}