"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getTopPerformers } from "@/services/orangTuaDashboardService";

export default function TopPerformersTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["top-performers-orangtua"],
    queryFn: () => getTopPerformers(),
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-0">
          <div className="space-y-2">
            <div className="text-xl font-bold">Siswa Terbaik</div>
            <div className="text-sm text-default-500">
              Siswa dengan rata-rata nilai tertinggi.
            </div>
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
          <div className="text-xl font-bold">Siswa Berprestasi</div>
          <div className="text-sm text-default-500">
            Siswa dengan rata-rata nilai tertinggi.
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40 text-danger-500">
          Gagal memuat data siswa berprestasi.
        </CardBody>
      </Card>
    );
  }

  const students = data.data ?? [];

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="space-y-2">
          <div className="text-xl font-bold">Siswa Terbaik</div>
          <div className="text-sm text-default-500">
            Siswa dengan rata-rata nilai tertinggi.
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-0 pt-2 pb-4">
        <Table removeWrapper>
          <TableHeader>
            <TableColumn className="w-16 text-center">#</TableColumn>
            <TableColumn>Nama</TableColumn>
            <TableColumn>NIS</TableColumn>
            <TableColumn>Kelas</TableColumn>
            <TableColumn className="text-right">Rata-rata</TableColumn>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((siswa: any, i: number) => (
                <TableRow key={siswa.id}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell>{siswa.nama}</TableCell>
                  <TableCell>{siswa.nis}</TableCell>
                  <TableCell>{siswa.kelas}</TableCell>
                  <TableCell className="text-right">
                    {siswa.rataRataNilai}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-default-400">
                  Tidak ada data siswa berprestasi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
