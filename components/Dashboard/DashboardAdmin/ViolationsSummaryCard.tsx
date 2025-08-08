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
import { getViolationsSummary } from "@/services/adminDashboardService";
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

export default function ViolationsSummaryCard() {
  // Periode default: bulan berjalan
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["violations-summary", startDate, endDate],
    queryFn: () => getViolationsSummary(startDate, endDate),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="text-xl font-bold">Pelanggaran Disiplin</div>
          <div className="text-sm text-default-500">
            Ringkasan pelanggaran siswa.
          </div>
        </CardHeader>
        <CardBody className="h-48 flex items-center justify-center">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card>
        <CardHeader>
          <div className="text-xl font-bold">Pelanggaran Disiplin</div>
          <div className="text-sm text-default-500">
            Ringkasan pelanggaran siswa.
          </div>
        </CardHeader>
        <CardBody className="text-center text-danger-500">
          Gagal memuat data pelanggaran.
        </CardBody>
      </Card>
    );
  }

  const { violationsByType, topViolators } = data.data;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">Pelanggaran Disiplin</div>
          <div className="text-sm text-default-500">
            Ringkasan pelanggaran siswa untuk bulan ini.
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-10">
        {/* Chart Pelanggaran Berdasarkan Jenis */}
        <div>
          <div className="text-lg font-semibold mb-3">
            Pelanggaran Berdasarkan Jenis
          </div>
          {violationsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={violationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jenis" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jumlah" fill="#82ca9d" name="Jumlah" />
                <Bar dataKey="totalPoin" fill="#8884d8" name="Total Poin" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-default-400">
              Data jenis pelanggaran tidak tersedia.
            </div>
          )}
        </div>

        {/* Tabel Top Pelanggar */}
        <div>
          <div className="text-lg font-semibold mb-3">Top Pelanggar</div>
          <Table aria-label="Tabel Top Pelanggar">
            <TableHeader>
              <TableColumn>Nama</TableColumn>
              <TableColumn>Kelas</TableColumn>
              <TableColumn>Total Pelanggaran</TableColumn>
              <TableColumn className="text-right">Total Poin</TableColumn>
            </TableHeader>
            <TableBody>
              {topViolators.length > 0 ? (
                topViolators.map((violator: any) => (
                  <TableRow key={violator.id}>
                    <TableCell>{violator.nama}</TableCell>
                    <TableCell>{violator.kelas}</TableCell>
                    <TableCell>{violator.totalPelanggaran}</TableCell>
                    <TableCell className="text-right">
                      {violator.totalPoin}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Tidak ada top pelanggar ditemukan.
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
