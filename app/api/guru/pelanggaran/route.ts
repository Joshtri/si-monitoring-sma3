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
                            siswa: {
                                include: {
                                    pelanggaran: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!guru) {
        return NextResponse.json({ success: false, message: "Guru tidak ditemukan" }, { status: 404 });
    }

    const data = guru.waliKelas.flatMap((kelas) =>
        kelas.siswa.flatMap((siswaKelas) =>
            siswaKelas.siswa.pelanggaran.map((p) => ({
                siswaId: siswaKelas.siswa.id,
                nama: siswaKelas.siswa.namaDepan + " " + (siswaKelas.siswa.namaBelakang || ""),
                kelas: kelas.kelas,
                jenisPelanggaran: p.jenisPelanggaran,
                tanggal: p.tanggal,
                poin: p.poin,
                tindakan: p.tindakan,
            }))
        )
    );

    return NextResponse.json({ success: true, data });
}



export async function POST(req: Request) {
  const user = await getAuthUserFromCookie();
  if (!user || user.role !== "GURU") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { siswaId, jenisPelanggaran, poin, tindakan, tanggal } = body;

  // Validasi apakah guru wali dari siswa tersebut
  const guru = await prisma.guru.findUnique({
    where: { userId: user.id },
    include: {
      waliKelas: {
        include: {
          siswa: true,
        },
      },
    },
  });

  const isSiswaWali = guru?.waliKelas.some((kelas) =>
    kelas.siswa.some((s) => s.siswaId === siswaId)
  );

  if (!isSiswaWali) {
    return NextResponse.json({ success: false, message: "Siswa bukan dari kelas yang diasuh" }, { status: 403 });
  }

  const pelanggaran = await prisma.pelanggaran.create({
    data: {
      siswaId,
      jenisPelanggaran,
      poin,
      tindakan,
      tanggal: new Date(tanggal),
    },
  });

  return NextResponse.json({ success: true, data: pelanggaran });
}
