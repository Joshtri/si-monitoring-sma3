"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getAttendanceSummary } from "@/services/adminDashboardService";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = {
    HADIR: "#4CAF50", // Hijau
    SAKIT: "#FFC107", // Kuning
    IZIN: "#2196F3", // Biru
    ALPHA: "#F44336", // Merah
};

export default function AttendanceSummaryCard() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    const { data, isLoading, isError } = useQuery({
        queryKey: ["attendance-summary", startDate, endDate],
        queryFn: () => getAttendanceSummary(startDate, endDate),
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Ringkasan Kehadiran</div>
                    <div className="text-sm text-default-500">
                        Gambaran status kehadiran.
                    </div>
                </CardHeader>
                <CardBody className="flex justify-center items-center h-48">
                    <Spinner size="lg" />
                </CardBody>
            </Card>
        );
    }

    if (isError || !data?.success) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Ringkasan Kehadiran</div>
                    <div className="text-sm text-default-500">
                        Gambaran status kehadiran.
                    </div>
                </CardHeader>
                <CardBody className="text-center text-danger-500">
                    Gagal memuat ringkasan kehadiran.
                </CardBody>
            </Card>
        );
    }

    const { summary, totalAbsensi } = data.data;
    const chartData = summary.map((item: any) => ({
        name: item.status,
        value: item.jumlah,
        percentage: item.persentase,
    }));

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-2">

                <div className="text-xl font-bold">Ringkasan Kehadiran</div>
                <div className="text-sm text-default-500">
                    Gambaran status kehadiran untuk bulan ini.
                </div>
                </div>
            </CardHeader>
            <CardBody>
                <div className="flex flex-col items-center gap-4">
                    {chartData.some((item: { name: string; value: number; percentage: number }) => item.value > 0) ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    labelLine={false}
                                    dataKey="value"
                                >
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[entry.name as keyof typeof COLORS]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number, name: string, props: any) => [
                                        `${value} (${props.payload.percentage}%)`,
                                        name,
                                    ]}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-default-400">
                            Tidak ada data kehadiran untuk periode ini.
                        </div>
                    )}

                    <div className="text-sm text-default-500">
                        Total Data: <strong>{totalAbsensi}</strong>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
