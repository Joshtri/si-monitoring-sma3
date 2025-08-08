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
import { getGradesOverview } from "@/services/orangTuaDashboardService";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline"; // Import ChartBarSquareIcon

interface GradesOverviewProps {
  semester?: string;
}

export default function GradesOverviewChart({ semester }: GradesOverviewProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["grades-overview", semester],
    queryFn: () => getGradesOverview(semester),
  });

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <ChartBarSquareIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">Rata-rata Nilai</div>
          <div className="text-sm text-gray-500 ml-auto">
            Rata-rata nilai anak berdasarkan jenis ujian.
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
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <ChartBarSquareIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">Rata-rata Nilai</div>
          <div className="text-sm text-gray-500 ml-auto">
            Rata-rata nilai anak berdasarkan jenis ujian.
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40 text-red-500 font-medium">
          Gagal memuat data nilai.
        </CardBody>
      </Card>
    );
  }

  const nilaiSummary = data.data;

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <ChartBarSquareIcon className="h-6 w-6 text-gray-600 mr-2" />
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold text-gray-900">Rata-rata Nilai</div>
          <div className="text-sm text-gray-500 ml-auto">
            Rata-rata nilai anak berdasarkan jenis ujian.
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-2 pb-4 px-0 overflow-x-auto">
        <Table removeWrapper className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tugas</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ulangan</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTS</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UAS</TableColumn>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {nilaiSummary.length > 0 ? (
              nilaiSummary.map((anak: any, i: number) => (
                <TableRow key={i} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{anak.nama}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{anak.tugas ?? "-"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{anak.ulangan ?? "-"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{anak.uts ?? "-"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{anak.uas ?? "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-lg text-gray-400">
                  Tidak ada data nilai ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
