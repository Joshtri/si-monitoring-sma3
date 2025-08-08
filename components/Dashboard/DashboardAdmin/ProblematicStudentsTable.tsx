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
import { getProblematicStudents } from "@/services/adminDashboardService";

export default function ProblematicStudentsTable() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["problematic-students", 5],
        queryFn: () => getProblematicStudents(5),
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Siswa Bermasalah</div>
                    <div className="text-sm text-default-500">
                        Siswa dengan ketidakhadiran terbanyak bulan ini.
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
                    <div className="text-xl font-bold">Siswa Bermasalah</div>
                    <div className="text-sm text-default-500">
                        Gagal memuat data siswa bermasalah.
                    </div>
                </CardHeader>
                <CardBody className="text-center text-danger-500">
                    Gagal memuat data siswa bermasalah.
                </CardBody>
            </Card>
        );
    }

    const students = data.data ?? [];

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-2">

                <div className="text-xl font-bold">Siswa Bermasalah</div>
                <div className="text-sm text-default-500">
                    Siswa dengan ketidakhadiran terbanyak bulan ini.
                </div>
                </div>
            </CardHeader>
            <CardBody>
                <Table>
                    <TableHeader>
                        <TableColumn>Nama</TableColumn>
                        <TableColumn>Kelas</TableColumn>
                        <TableColumn>Total Ketidakhadiran</TableColumn>
                        <TableColumn className="text-right">Rincian</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {students.length > 0 ? (
                            students.map((student: any) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.nama}</TableCell>
                                    <TableCell>{student.kelas}</TableCell>
                                    <TableCell>{student.totalAbsensi}</TableCell>
                                    <TableCell className="text-right">
                                        A: {student.breakdown.ALPHA} S: {student.breakdown.SAKIT} I:{" "}
                                        {student.breakdown.IZIN}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    Tidak ditemukan siswa bermasalah.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
}
