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
import { getActivitiesParticipation } from "@/services/adminDashboardService";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from "recharts";

export default function ActivitiesParticipationOverview() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["activities-participation"],
        queryFn: getActivitiesParticipation,
    });

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <div className="text-xl font-bold">Partisipasi Kegiatan</div>
                    <div className="text-sm text-default-500">
                        Gambaran umum kegiatan siswa.
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
            <Card className="w-full">
                <CardHeader>
                    <div className="text-xl font-bold">Partisipasi Kegiatan</div>
                    <div className="text-sm text-default-500">
                        Gambaran umum kegiatan siswa.
                    </div>
                </CardHeader>
                <CardBody className="text-center text-danger-500">
                    Gagal memuat data kegiatan.
                </CardBody>
            </Card>
        );
    }

    const { activitiesByType, topParticipants, recentActivities } = data.data;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex flex-col gap-2">

                <div className="text-xl font-bold">Partisipasi Kegiatan</div>
                <div className="text-sm text-default-500">
                    Gambaran umum kegiatan siswa.
                </div>
                </div>
            </CardHeader>
            <CardBody className="space-y-10">
                {/* 1. Bar Chart */}
                <div>
                    <div className="text-lg font-semibold mb-3">Kegiatan Berdasarkan Jenis</div>
                    {activitiesByType.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={activitiesByType}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="jenis" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="jumlah" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-default-400 h-[250px] flex items-center justify-center">
                            Tidak ada data jenis kegiatan.
                        </div>
                    )}
                </div>

                {/* 2. Top Participants */}
                <div>
                    <div className="text-lg font-semibold mb-3">Peserta Terbanyak</div>
                    <Table aria-label="Peserta Kegiatan Terbanyak">
                        <TableHeader>
                            <TableColumn>Nama</TableColumn>
                            <TableColumn>Kelas</TableColumn>
                            <TableColumn className="text-right">Total Kegiatan</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {topParticipants.length > 0 ? (
                                topParticipants.map((participant: any) => (
                                    <TableRow key={participant.id}>
                                        <TableCell>{participant.nama}</TableCell>
                                        <TableCell>{participant.kelas}</TableCell>
                                        <TableCell className="text-right">
                                            {participant.totalAktivitas}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        Tidak ada peserta terbanyak.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* 3. Recent Activities */}
                <div>
                    <div className="text-lg font-semibold mb-3">Kegiatan Terbaru</div>
                    <Table aria-label="Kegiatan Terbaru">
                        <TableHeader>
                            <TableColumn>Nama Kegiatan</TableColumn>
                            <TableColumn>Jenis</TableColumn>
                            <TableColumn>Siswa</TableColumn>
                            <TableColumn className="text-right">Tanggal</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity: any) => (
                                    <TableRow key={activity.id}>
                                        <TableCell>{activity.namaKegiatan}</TableCell>
                                        <TableCell>{activity.jenis}</TableCell>
                                        <TableCell>
                                            {activity.siswa.nama} ({activity.siswa.kelas})
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Date(activity.tanggal).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        Tidak ada kegiatan terbaru.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardBody>
        </Card>
    );
}
