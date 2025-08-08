"use client";

import { useQuery } from "@tanstack/react-query";
import { getKelasInfoList } from "@/services/orangTuaDashboardService";
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import { PageHeader } from "@/components/common/PageHeader";
import { useRouter } from "next/navigation";

export default function OrangTuaKelasPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["parent-kelas-info"],
    queryFn: getKelasInfoList,
  });

  return (
    <>
      <PageHeader
        title="Informasi Kelas Anak"
        description="Berikut informasi kelas dan wali kelas untuk setiap anak."
        breadcrumbs={[
          { label: "Dashboard", href: "/orang-tua/dashboard" },
          { label: "Kelas Anak", href: "/orang-tua/kelas" },
        ]}
      />
      <Card className="w-full">
        <CardHeader className="pb-0" />
        <CardBody className="pt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner size="lg" />
            </div>
          ) : isError || !data?.success ? (
            <div className="text-danger-500 text-center">
              Gagal memuat data kelas.
            </div>
          ) : (
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>Nama</TableColumn>
                <TableColumn>Kelas</TableColumn>
                <TableColumn>Tahun Ajaran</TableColumn>
                <TableColumn>Wali Kelas</TableColumn>
                <TableColumn>Aksi</TableColumn>
              </TableHeader>
              <TableBody>
                {data.data.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.kelas}</TableCell>
                    <TableCell>{item.tahunAjaran}</TableCell>
                    <TableCell>{item.waliKelas}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="solid"
                          onClick={() =>
                            router.push(`/orang-tua/kelas/${item.siswaId}/jadwal`)
                          }
                        >
                          Lihat Jadwal
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(`/orang-tua/kelas/${item.siswaId}/mata-pelajaran`)
                          }
                        >
                          Mata Pelajaran
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </>
  );
}
