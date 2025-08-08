"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getActivitiesSummary } from "@/services/orangTuaDashboardService";
import { SparklesIcon } from "@heroicons/react/24/outline"; // Import SparklesIcon

export default function ActivitiesSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["parent-activities-summary"],
    queryFn: getActivitiesSummary,
  });

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <SparklesIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">Ringkasan Kegiatan Anak</div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan aktivitas anak seperti ekstrakurikuler, organisasi, dan lomba.
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
          <SparklesIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">Ringkasan Kegiatan Anak</div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan aktivitas anak seperti ekstrakurikuler, organisasi, dan lomba.
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40 text-red-500 font-medium">
          Gagal memuat data kegiatan anak.
        </CardBody>
      </Card>
    );
  }

  const kegiatan = data.data;

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <SparklesIcon className="h-6 w-6 text-gray-600 mr-2" />
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold text-gray-900">Ringkasan Kegiatan Anak</div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan aktivitas anak seperti ekstrakurikuler, organisasi, dan lomba.
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-2 pb-4 px-0 overflow-x-auto">
        <Table removeWrapper className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Anak</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kegiatan</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kegiatan</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</TableColumn>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {kegiatan.length > 0 ? (
              kegiatan.map((k: any, index: number) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{k.nama}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{k.jenis}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{k.namaKegiatan}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(k.tanggal).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{k.catatan || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-lg text-gray-400">
                  Tidak ada aktivitas ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
