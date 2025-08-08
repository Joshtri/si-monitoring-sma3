"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getAnakOverview } from "@/services/orangTuaDashboardService";
import { UserGroupIcon } from "@heroicons/react/24/outline"; // Import UserGroupIcon

export default function PerAnakSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["parent-children-summary"],
    queryFn: getAnakOverview,
  });

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <UserGroupIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">Data Semua Anak</div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan daftar anak dari akun orang tua ini.
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
          <UserGroupIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">Data Semua Anak</div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan daftar anak dari akun orang tua ini.
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40 text-red-500 font-medium">
          Gagal memuat data anak.
        </CardBody>
      </Card>
    );
  }

  const children = data.data;

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <UserGroupIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="flex flex-col gap-2">

        <div className="text-xl font-bold text-gray-900">Data Semua Anak</div>
        <div className="text-sm text-gray-500 ml-auto">
          Menampilkan daftar anak dari akun orang tua ini.
        </div>
          </div>
      </CardHeader>
      <CardBody className="pt-2 pb-4 px-0 overflow-x-auto">
        <Table removeWrapper className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Ajaran</TableColumn>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {children.length > 0 ? (
              children.map((anak: any, index: number) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{anak.nama}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{anak.nis || "-"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{anak.jenisKelamin}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{anak.kelas}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{anak.tahunAjaran}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-lg text-gray-400">
                  Tidak ada anak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
