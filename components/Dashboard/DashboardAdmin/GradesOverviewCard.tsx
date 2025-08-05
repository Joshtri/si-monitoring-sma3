"use client";

import * as React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Spinner } from "@heroui/react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getGradesOverview } from "@/services/adminDashboardService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function GradesOverviewCard() {
    const [semester, setSemester] = React.useState<string>("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["grades-overview", semester],
        queryFn: () => getGradesOverview(semester || undefined),
    });

    const semesterOptions = [
        { key: "", label: "Semua Semester" },
        { key: "Ganjil", label: "Ganjil" },
        { key: "Genap", label: "Genap" },
    ];

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Ringkasan Nilai</div>
                    <div className="text-sm text-default-500">
                        Rata-rata nilai dan distribusi.
                    </div>
                </CardHeader>
                <CardBody className="flex items-center justify-center h-48">
                    <Spinner size="lg" />
                </CardBody>
            </Card>
        );
    }

    if (isError || !data?.success) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-xl font-bold">Ringkasan Nilai</div>
                    <div className="text-sm text-default-500">
                        Rata-rata nilai dan distribusi.
                    </div>
                </CardHeader>
                <CardBody className="text-center text-danger-500">
                    Gagal memuat data nilai.
                </CardBody>
            </Card>
        );
    }

    const { avgGradesBySubject, gradeDistribution } = data.data;
    type GradeDataItem = { name: string; value: number };
    const gradeData: GradeDataItem[] = Object.entries(gradeDistribution).map(
        ([name, value]) => ({
            name,
            value: Number(value),
        })
    );

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="text-xl font-bold">Ringkasan Nilai</div>
                    <div className="text-sm text-default-500">
                        Rata-rata nilai dan distribusi.
                    </div>
                </div>
                <Select
                    label="Semester"
                    placeholder="Pilih Semester"
                    items={semesterOptions}
                    selectedKeys={[semester]}
                    onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        setSemester(String(selected));
                    }}
                    className="w-[200px]"
                >
                    {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                </Select>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bagian Tabel */}
                    <div>
                        <div className="text-lg font-semibold mb-3">
                            Rata-rata Nilai per Mata Pelajaran
                        </div>
                        <Table>
                            <TableHeader>
                                <TableColumn>Mata Pelajaran</TableColumn>
                                <TableColumn className="text-right">Rata-rata</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {avgGradesBySubject.length > 0 ? (
                                    avgGradesBySubject.map((item: any) => (
                                        <TableRow key={item.mataPelajaran}>
                                            <TableCell>{item.mataPelajaran}</TableCell>
                                            <TableCell className="text-right">
                                                {item.rataRata}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Data tidak tersedia.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Bagian Diagram Lingkaran */}
                    <div>
                        <div className="text-lg font-semibold mb-3">Distribusi Nilai</div>
                        {gradeData.some((g) => g.value > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={gradeData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        labelLine={false}
                                    >
                                        {gradeData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-default-400">
                                Tidak ada data distribusi.
                            </div>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
