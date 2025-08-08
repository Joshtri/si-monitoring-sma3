"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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
} from "@heroui/react";
import { PageHeader } from "@/components/common/PageHeader";
import api from "@/lib/axios";

interface JadwalItem {
  hari: string;
  jamKe: number;
  mapel: string;
  guru: string;
}

export default function JadwalSiswaPage() {
  const params = useParams();
  const siswaId = params?.siswaId as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jadwal-siswa", siswaId],
    queryFn: async () => {
      const res = await api.get(`/api/orang-tua/kelas/${siswaId}/jadwal`);
      return res.data;
    },
    enabled: !!siswaId,
  });

  const jadwal: JadwalItem[] = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Jadwal Pelajaran Anak"
        description="Jadwal pelajaran mingguan berdasarkan kelas siswa."
        breadcrumbs={[
          { label: "Dashboard", href: "/orang-tua/dashboard" },
          { label: "Informasi Kelas", href: "/orang-tua/kelas" },
          { label: "Jadwal", href: "#" },
        ]}
        backHref="/orang-tua/kelas"
      />
      <Card className="w-full">
        <CardHeader className="pb-0">
          <h2 className="text-xl font-bold">Jadwal Pelajaran</h2>
        </CardHeader>
        <CardBody className="pt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner size="lg" />
            </div>
          ) : isError || !data?.success ? (
            <div className="text-center text-danger-500">
              Gagal memuat jadwal pelajaran.
            </div>
          ) : jadwal.length === 0 ? (
            <div className="text-center text-default-500">
              Jadwal belum tersedia.
            </div>
          ) : (
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>Hari</TableColumn>
                <TableColumn>Jam ke</TableColumn>
                <TableColumn>Mata Pelajaran</TableColumn>
                <TableColumn>Guru</TableColumn>
              </TableHeader>
              <TableBody>
                {jadwal.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.hari}</TableCell>
                    <TableCell>{item.jamKe}</TableCell>
                    <TableCell>{item.mapel}</TableCell>
                    <TableCell>{item.guru}</TableCell>
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
