"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ListGrid } from "@/components/ui/ListGrid";
import { Chip, Button } from "@heroui/react";
import { getSiswaByKelasId } from "@/services/kelasService";
import { useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";

export default function SiswaKelasPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: siswaList = [], isLoading } = useQuery({
    queryKey: ["kelas", id, "siswa"],
    queryFn: () => getSiswaByKelasId(id as string),
    enabled: !!id,
  });

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "nama", label: "Nama Siswa" },
      { key: "jenisKelamin", label: "Jenis Kelamin" },
      { key: "nis", label: "NIS" },
      { key: "nisn", label: "NISN" },
      { key: "orangTua", label: "Orang Tua" },
    ];

    const rows = siswaList.map((siswa: any) => ({
      key: siswa.id,
      nama: siswa.nama,
      jenisKelamin: (
        <Chip color="default">
          {siswa.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
        </Chip>
      ),
      nis: siswa.nis || "-",
      nisn: siswa.nisn || "-",
      orangTua: siswa.orangTua,
    }));

    return { columns, rows };
  }, [siswaList]);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        title={"Siswa Kelas"}
        description="Daftar siswa yang terdaftar di kelas ini"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Kelas", href: "/admin/kelas" },
          { label: "Siswa Kelas" },
        ]}
        backHref={`/admin/kelas`}
        actions={
          <Button
            color="primary"
            onPress={() => router.push(`/admin/kelas/${id}/siswa/assign`)}
          >
            Tambah Siswa
          </Button>
        }
      />

      <ListGrid
        columns={columns}
        rows={rows}
        loading={isLoading}
        searchPlaceholder="Cari nama siswa..."
      />
    </div>
  );
}
