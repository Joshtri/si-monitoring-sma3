"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getStudentsPerClass } from "@/services/adminDashboardService";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

export default function StudentsPerClassChart() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["students-per-class"],
        queryFn: getStudentsPerClass,
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Siswa Per Kelas</div>
                    <div className="text-sm text-default-500">
                        Jumlah siswa di setiap kelas untuk tahun ajaran aktif.
                    </div>
                </CardHeader>
                <CardBody className="h-64 flex items-center justify-center">
                    <Spinner size="lg" />
                </CardBody>
            </Card>
        );
    }

    if (isError || !data?.success) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Siswa Per Kelas</div>
                    <div className="text-sm text-default-500">
                        Jumlah siswa di setiap kelas untuk tahun ajaran aktif.
                    </div>
                </CardHeader>
                <CardBody className="text-center text-danger-500">
                    Gagal memuat data siswa per kelas.
                </CardBody>
            </Card>
        );
    }

    const studentsPerClass = data.data ?? [];

    return (
        <Card>
            <CardHeader>
                <div className="text-xl font-bold">Siswa Per Kelas</div>
                <div className="text-sm text-default-500">
                    Jumlah siswa di setiap kelas untuk tahun ajaran aktif.
                </div>
            </CardHeader>
            <CardBody>
                {studentsPerClass.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={studentsPerClass}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="kelas" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="jumlahSiswa" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-default-400">
                        Data siswa per kelas tidak tersedia.
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
