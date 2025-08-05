// app/api/admin/dashboard/activities/participation/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/dashboard/activities/participation
export async function GET() {
    try {
        const [activitiesByType, topParticipants, recentActivities] = await Promise.all([
            // Aktivitas berdasarkan jenis
            prisma.aktivitas.groupBy({
                by: ['jenis'],
                _count: { jenis: true }
            }),

            // Siswa paling aktif
            prisma.siswa.findMany({
                include: {
                    aktivitas: {
                        orderBy: { tanggal: 'desc' }
                    },
                    siswaKelas: {
                        include: {
                            kelasTahunAjaran: {
                                select: { kelas: true }
                            }
                        }
                    }
                }
            }),

            // Aktivitas terbaru
            prisma.aktivitas.findMany({
                take: 10,
                orderBy: { tanggal: 'desc' },
                include: {
                    siswa: {
                        include: {
                            siswaKelas: {
                                include: {
                                    kelasTahunAjaran: {
                                        select: { kelas: true }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        ]);

        // Format activities by type
        const activitiesByTypeFormatted = activitiesByType.map(a => ({
            jenis: a.jenis,
            jumlah: a._count.jenis
        }));

        // Format top participants
        const topParticipantsFormatted = topParticipants
            .map(siswa => {
                // Breakdown aktivitas berdasarkan jenis
                const aktivitasByType = siswa.aktivitas.reduce((acc: any, a) => {
                    acc[a.jenis] = (acc[a.jenis] || 0) + 1;
                    return acc;
                }, {});

                return {
                    id: siswa.id,
                    nama: `${siswa.namaDepan} ${siswa.namaTengah || ''} ${siswa.namaBelakang || ''}`.trim(),
                    nis: siswa.nis,
                    kelas: siswa.siswaKelas[0]?.kelasTahunAjaran?.kelas || 'N/A',
                    totalAktivitas: siswa.aktivitas.length,
                    aktivitasByType
                };
            })
            .filter(student => student.totalAktivitas > 0)
            .sort((a, b) => b.totalAktivitas - a.totalAktivitas)
            .slice(0, 10);

        // Format recent activities
        const recentActivitiesFormatted = recentActivities.map(activity => ({
            id: activity.id,
            namaKegiatan: activity.namaKegiatan,
            jenis: activity.jenis,
            tanggal: activity.tanggal,
            catatan: activity.catatan,
            siswa: {
                nama: `${activity.siswa.namaDepan} ${activity.siswa.namaTengah || ''} ${activity.siswa.namaBelakang || ''}`.trim(),
                nis: activity.siswa.nis,
                kelas: activity.siswa.siswaKelas[0]?.kelasTahunAjaran?.kelas || 'N/A'
            }
        }));

        return NextResponse.json({
            success: true,
            data: {
                activitiesByType: activitiesByTypeFormatted,
                topParticipants: topParticipantsFormatted,
                recentActivities: recentActivitiesFormatted
            }
        });
    } catch (error) {
        console.error("Error fetching activities participation:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data partisipasi aktivitas", error },
            { status: 500 }
        );
    }
}