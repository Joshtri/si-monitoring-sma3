"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getDailyAttendanceTrend } from "@/services/adminDashboardService";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function DailyAttendanceTrendChart() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["daily-attendance-trend", 7],
        queryFn: () => getDailyAttendanceTrend(7),
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Tren Kehadiran Harian</div>
                    <div className="text-sm text-default-500">
                        Status kehadiran selama 7 hari terakhir.
                    </div>
                </CardHeader>
                <CardBody className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </CardBody>
            </Card>
        );
    }

    if (isError || !data?.success) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Tren Kehadiran Harian</div>
                    <div className="text-sm text-default-500">
                        Status kehadiran selama 7 hari terakhir.
                    </div>
                </CardHeader>
                <CardBody className="text-center text-danger-500">
                    Gagal memuat data tren kehadiran.
                </CardBody>
            </Card>
        );
    }

    const trendData = data.data;

    return (
        <Card>
            <CardHeader>
                <div className="text-xl font-bold">Tren Kehadiran Harian</div>
                <div className="text-sm text-default-500">
                    Status kehadiran selama 7 hari terakhir.
                </div>
            </CardHeader>
            <CardBody>
                {trendData && trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={trendData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="HADIR"
                                stroke="#4CAF50"
                                name="Hadir"
                            />
                            <Line
                                type="monotone"
                                dataKey="SAKIT"
                                stroke="#8884d8"
                                name="Sakit"
                            />
                            <Line
                                type="monotone"
                                dataKey="IZIN"
                                stroke="#ffc658"
                                name="Izin"
                            />
                            <Line
                                type="monotone"
                                dataKey="ALPHA"
                                stroke="#F44336"
                                name="Alpha"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-default-400">
                        Data tren kehadiran tidak tersedia.
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
