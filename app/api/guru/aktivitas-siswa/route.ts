import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookie } from "@/lib/auth/getAuthUser";

export async function GET(req: NextRequest) {
    const user = await getAuthUserFromCookie();
    if (!user || user.role !== "GURU") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
                                    aktivitas: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!guru?.waliKelas || guru.waliKelas.length === 0) {
        return NextResponse.json({ message: "Anda bukan wali kelas" }, { status: 403 });
    }

    const kelas = guru.waliKelas[0];

    const aktivitasList = kelas.siswa.flatMap((sk) =>
        sk.siswa.aktivitas.map((a) => ({
            id: a.id,
            siswaId: sk.siswa.id,
            namaSiswa: [sk.siswa.namaDepan, sk.siswa.namaTengah, sk.siswa.namaBelakang]
                .filter(Boolean)
                .join(" "),
            namaKegiatan: a.namaKegiatan,
            jenis: a.jenis,
            tanggal: a.tanggal,
            catatan: a.catatan || "-",
        }))
    );

    return NextResponse.json({
        success: true,
        data: aktivitasList,
    });
}


export async function POST(req: NextRequest) {
    const user = await getAuthUserFromCookie();
    if (!user || user.role !== "GURU") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { siswaId, namaKegiatan, jenis, tanggal, catatan } = body || {};

    // Validasi data
    if (!siswaId || !namaKegiatan || !jenis || !tanggal) {
        return NextResponse.json(
            { message: "Field wajib tidak lengkap" },
            { status: 400 }
        );
    }

    // Validasi: siswa harus di kelas wali guru ini
    const guru = await prisma.guru.findUnique({
        where: { userId: user.id },
        include: {
            waliKelas: {
                include: {
                    siswa: { include: { siswa: true } },
                },
            },
        },
    });

    if (!guru?.waliKelas || guru.waliKelas.length === 0) {
        return NextResponse.json({ message: "Anda bukan wali kelas" }, { status: 403 });
    }

    const kelas = guru.waliKelas[0];
    const siswaAda = kelas.siswa.some((sk) => sk.siswa.id === siswaId);
    if (!siswaAda) {
        return NextResponse.json(
            { message: "Siswa tidak berada di kelas Anda" },
            { status: 403 }
        );
    }

    // Simpan data aktivitas
    await prisma.aktivitas.create({
        data: {
            siswaId,
            namaKegiatan,
            jenis, // Enum: EKSTRAKURIKULER | ORGANISASI | LOMBA
            tanggal: new Date(tanggal),
            catatan: catatan || null,
        },
    });

    return NextResponse.json({
        success: true,
        message: "Aktivitas berhasil disimpan",
    });
}