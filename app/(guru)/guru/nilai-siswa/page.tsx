"use client";

import { useQuery } from "@tanstack/react-query";
import { getMataPelajaranKelasWali } from "@/services/guruService";
import { Card, CardHeader, CardBody, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";

export default function NilaiSiswaPage() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["mapel-wali"],
    queryFn: getMataPelajaranKelasWali,
  });

  const mapelList = data?.data ?? [];

  if (isLoading) {
    return <Spinner className="mx-auto mt-10" />;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        Gagal memuat data mata pelajaran.
      </p>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Guru", href: "/guru" },
          { label: "Nilai Siswa", href: "/guru/nilai-siswa" },
        ]}
      />
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Nilai Siswa</h1>
        <p className="text-gray-600">
          Hanya wali kelas yang dapat mengakses dan mengisi nilai untuk semua
          mata pelajaran di kelasnya.
        </p>

        {mapelList.length === 0 ? (
          <p className="text-gray-500 mt-4">Belum ada mata pelajaran.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mapelList.map((mapel: any) => (
              <Card key={mapel.id}>
                <CardHeader>
                  <h2 className="font-semibold">{mapel.nama}</h2>
                </CardHeader>
                <CardBody className="space-y-2">
                  <p className="text-sm text-gray-500">Kode: {mapel.id}</p>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => router.push(`/guru/nilai-siswa/${mapel.id}`)}
                    className="w-full"
                  >
                    Input Nilai
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
