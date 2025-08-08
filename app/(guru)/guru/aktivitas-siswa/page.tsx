"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Spinner,
  Card,
  CardHeader,
  CardBody,
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

export default function AktivitasSiswaPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["aktivitas-siswa"],
    queryFn: async () => {
      const res = await axios.get("/api/guru/aktivitas-siswa");
      return res.data.data;
    },
  });

  if (isLoading) return <Spinner className="mt-10 mx-auto" />;
  if (error)
    return (
      <p className="text-red-500 text-center">
        Gagal memuat data aktivitas siswa.
      </p>
    );

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/guru/dashboard" },
          { label: "Aktivitas Siswa", href: "/guru/aktivitas-siswa" },
        ]}

        actions={
            <Button onPress={() => router.push("/guru/aktivitas-siswa/create")} color="primary">
                Tambah Aktivitas Siswa
            </Button>
        }
      />
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Aktivitas Siswa</h1>
        <p className="text-gray-600">
          Daftar aktivitas siswa yang telah Anda catat sebagai wali kelas.
        </p>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Daftar Aktivitas</h2>
          </CardHeader>
          <CardBody>
            {data.length === 0 ? (
              <p className="text-gray-500">Belum ada aktivitas siswa.</p>
            ) : (
              <Table aria-label="Daftar Aktivitas Siswa">
                <TableHeader>
                  <TableColumn>Nama Siswa</TableColumn>
                  <TableColumn>Nama Kegiatan</TableColumn>
                  <TableColumn>Jenis</TableColumn>
                  <TableColumn>Tanggal</TableColumn>
                  <TableColumn>Catatan</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.namaSiswa}</TableCell>
                      <TableCell>{item.namaKegiatan}</TableCell>
                      <TableCell>{item.jenis}</TableCell>
                      <TableCell>
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>{item.catatan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
