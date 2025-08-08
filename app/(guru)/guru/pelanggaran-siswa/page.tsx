"use client";

import { Card, CardHeader, CardBody, Spinner, Button } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getPelanggaranSiswa } from "@/services/guruService";
import { PageHeader } from "@/components/common/PageHeader";
import { useRouter } from "next/navigation";

export default function PelanggaranSiswaPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pelanggaran-siswa"],
    queryFn: getPelanggaranSiswa,
  });

  const router = useRouter();
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
          <h2 className="font-semibold text-lg text-gray-800">
            Pelanggaran Siswa
          </h2>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
          <h2 className="font-semibold text-lg text-gray-800">
            Pelanggaran Siswa
          </h2>
        </CardHeader>
        <CardBody className="text-center text-red-500 font-medium">
          Gagal memuat data pelanggaran siswa.
        </CardBody>
      </Card>
    );
  }

  const pelanggaranList = data.data;

  return (
    <>
      <PageHeader
        title="Pelanggaran Siswa"
        breadcrumbs={[
          { label: "Guru", href: "/guru" },
          { label: "Pelanggaran Siswa", href: "/guru/pelanggaran-siswa" },
        ]}
        actions={
          <Button
            color="primary"
            onPress={() => router.push("/guru/pelanggaran-siswa/create")}
          >
            Tambah Pelanggaran Siswa
          </Button>
        }
      />
      <Card>
        <CardHeader className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
          <h2 className="font-semibold text-lg text-gray-800">
            Pelanggaran Siswa
          </h2>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <Table removeWrapper className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50">
              <TableColumn className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Nama
              </TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Kelas
              </TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Jenis Pelanggaran
              </TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Poin
              </TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Tindakan
              </TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Tanggal
              </TableColumn>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {pelanggaranList.length > 0 ? (
                pelanggaranList.map((p: any, i: number) => (
                  <TableRow key={i} className="hover:bg-gray-50">
                    <TableCell className="px-6 py-4 text-sm text-gray-800">
                      {p.nama}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-800">
                      {p.kelas}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-800">
                      {p.jenisPelanggaran}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-800">
                      {p.poin}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-800">
                      {p.tindakan}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-800">
                      {new Date(p.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-gray-400"
                  >
                    Tidak ada data pelanggaran.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
