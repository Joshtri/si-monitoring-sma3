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
import { getAttendanceHistory } from "@/services/orangTuaDashboardService";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline"; // Import ClipboardDocumentListIcon

interface AttendanceHistoryProps {
  siswaId: string;
}

export default function AttendanceHistory({ siswaId }: AttendanceHistoryProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendance-history", siswaId],
    queryFn: () => getAttendanceHistory(siswaId),
    enabled: !!siswaId,
  });

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <ClipboardDocumentListIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">Riwayat Absensi</div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan daftar kehadiran siswa berdasarkan tanggal.
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
          <ClipboardDocumentListIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">Riwayat Absensi</div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan daftar kehadiran siswa berdasarkan tanggal.
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40 text-red-500 font-medium">
          Gagal memuat riwayat absensi.
        </CardBody>
      </Card>
    );
  }

  const rawData = data.data ?? [];

  const absen = rawData.flatMap((entry: any) =>
    entry.anak
      .filter((anak: any) => anak.id === siswaId)
      .map((anak: any) => ({
        nama: entry.nama,
        tanggal: entry.tanggal,
        status: anak.status,
        keterangan: anak.keterangan ?? "-", // atau bisa null/undefined
      }))
  );

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <ClipboardDocumentListIcon className="h-6 w-6 text-gray-600 mr-2" />
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold text-gray-900">Riwayat Absensi</div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan daftar kehadiran siswa berdasarkan tanggal.
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-2 pb-4 px-0 overflow-x-auto">
        <Table removeWrapper className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Keterangan
            </TableColumn>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {absen.length > 0 ? (
              absen.map((item: any, index: number) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nama ?? '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.tanggal}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.status ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.keterangan || "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-lg text-gray-400"
                >
                  Tidak ada data absensi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
