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
import { getViolationsHistory } from "@/services/orangTuaDashboardService";
import { HandRaisedIcon } from "@heroicons/react/24/outline"; // Import HandRaisedIcon

interface ViolationsHistoryProps {
  siswaId: string;
}

export default function ViolationsHistory({ siswaId }: ViolationsHistoryProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["violations-history", siswaId],
    queryFn: () => getViolationsHistory(siswaId),
    enabled: !!siswaId,
  });

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <HandRaisedIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">
            Riwayat Pelanggaran
          </div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan semua pelanggaran siswa.
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
          <HandRaisedIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">
            Riwayat Pelanggaran
          </div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan semua pelanggaran siswa.
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40 text-red-500 font-medium">
          Gagal memuat data pelanggaran.
        </CardBody>
      </Card>
    );
  }

  const pelanggaran = data.data ?? [];

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <HandRaisedIcon className="h-6 w-6 text-gray-600 mr-2" />
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold text-gray-900">
            Riwayat Pelanggaran
          </div>
          <div className="text-sm text-gray-500 ml-auto">
            Menampilkan semua pelanggaran siswa.
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-2 pb-4 px-0 overflow-x-auto">
        <Table removeWrapper className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis
            </TableColumn>
            <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tindakan
            </TableColumn>
            <TableColumn className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Poin
            </TableColumn>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {pelanggaran.length > 0 ? (
              pelanggaran.map((item: any, index: number) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.jenisPelanggaran}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tindakan}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                    {item.poin}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-lg text-gray-400"
                >
                  Tidak ada pelanggaran tercatat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
