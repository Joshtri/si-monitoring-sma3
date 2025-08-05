"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getOverviewStats } from "@/services/adminDashboardService";

const statsCards = [
    {
        key: "totalSiswa",
        label: "Total Siswa",
        icon: "👨‍🎓",
        subtitle: (tahun: string) => `Aktif di ${tahun}`,
    },
    {
        key: "totalGuru",
        label: "Total Guru",
        icon: "👩‍🏫",
        subtitle: () => "Semua staf aktif",
    },
    {
        key: "totalKelas",
        label: "Total Kelas",
        icon: "🏫",
        subtitle: (tahun: string) => `Di ${tahun}`,
    },
    {
        key: "totalMapel",
        label: "Total Mapel",
        icon: "📚",
        subtitle: () => "Mapel aktif",
    },
];

export default function OverviewCards() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["overview-stats"],
        queryFn: getOverviewStats,
    });

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex justify-between items-center">
                            <div className="text-sm font-medium text-default-500">
                                Memuat...
                            </div>
                            <Spinner size="sm" />
                        </CardHeader>
                        <CardBody>
                            <div className="text-2xl font-bold">–</div>
                            <div className="text-xs text-default-400">–</div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    }

    if (isError || !data?.success) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-4 text-center text-danger-500">
                    <CardBody>Gagal memuat statistik overview.</CardBody>
                </Card>
            </div>
        );
    }

    const { totalSiswa, totalGuru, totalKelas, totalMapel, tahunAjaranAktif } =
        data.data;

    const statValues = {
        totalSiswa,
        totalGuru,
        totalKelas,
        totalMapel,
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((item) => (
                <Card key={item.key}>
                    <CardHeader className="flex justify-between items-center">
                        <div className="text-sm font-medium text-default-500">
                            {item.label}
                        </div>
                        <div className="text-lg">{item.icon}</div>
                    </CardHeader>
                    <CardBody>
                        <div className="text-2xl font-bold">
                            {statValues[item.key as keyof typeof statValues]}
                        </div>
                        <div className="text-xs text-default-400">
                            {item.subtitle(tahunAjaranAktif)}
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
