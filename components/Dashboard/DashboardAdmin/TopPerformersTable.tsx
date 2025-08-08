"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getTopPerformers } from "@/services/adminDashboardService";

export default function TopPerformersTable() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["top-performers"],
        queryFn: () => getTopPerformers(5), // 5 siswa terbaik
    });

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader className="pb-0">
                    <div className="text-xl font-bold">Siswa Terbaik</div>
                    <div className="text-sm text-default-500">
                        Siswa dengan rata-rata nilai tertinggi.
                    </div>
                </CardHeader>
                <CardBody className="flex items-center justify-center h-40">
                    <Spinner size="lg" />
                </CardBody>
            </Card>
        );
    }

    if (isError || !data?.success) {
        return (
            <Card className="w-full">
                <CardHeader className="pb-0">
                    <div className="text-xl font-bold">Siswa Terbaik</div>
                    <div className="text-sm text-default-500">
                        Siswa dengan rata-rata nilai tertinggi.
                    </div>
                </CardHeader>
                <CardBody className="flex items-center justify-center h-40 text-danger-500">
                    Gagal memuat data siswa terbaik.
                </CardBody>
            </Card>
        );
    }

    const topPerformers = data.data ?? [];

    return (
        <Card className="w-full">
            <CardHeader className="pb-0">
                <div className="flex flex-col gap-2">

                <div className="text-xl font-bold">Siswa Terbaik</div>
                <div className="text-sm text-default-500">
                    Siswa dengan rata-rata nilai tertinggi.
                </div>
                </div>
            </CardHeader>
            <CardBody className="px-0 pt-2 pb-4">
                <Table removeWrapper>
                    <TableHeader>
                        <TableColumn className="w-16 text-center">Peringkat</TableColumn>
                        <TableColumn>Nama</TableColumn>
                        <TableColumn>NIS</TableColumn>
                        <TableColumn>Kelas</TableColumn>
                        <TableColumn className="text-right">Rata-rata Nilai</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {topPerformers.length > 0 ? (
                            topPerformers.map((student: any, index: number) => (
                                <TableRow key={student.id}>
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell>{student.nama}</TableCell>
                                    <TableCell>{student.nis}</TableCell>
                                    <TableCell>{student.kelas}</TableCell>
                                    <TableCell className="text-right">
                                        {student.rataRataNilai}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Tidak ada siswa terbaik ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
}
