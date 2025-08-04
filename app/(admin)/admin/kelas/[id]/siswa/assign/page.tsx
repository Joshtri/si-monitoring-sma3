"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Spinner,
} from "@heroui/react";
import { PageHeader } from "@/components/common/PageHeader";
import { getAllSiswa } from "@/services/siswaService";
import { assignSiswaToKelas } from "@/services/kelasService";
import { showToast } from "@/utils/toastHelper";

export default function AssignSiswaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: siswaList = [], isLoading } = useQuery({
    queryKey: ["siswa", "all"],
    queryFn: () => getAllSiswa(),
  });

  const assignMutation = useMutation({
    mutationFn: () => assignSiswaToKelas(id as string, selectedIds),
    onSuccess: () => {
      showToast({
        title: "Siswa berhasil ditambahkan ke kelas",
        description: "Siswa telah berhasil ditambahkan ke kelas.",
        color: "success",
      });
      router.push(`/admin/kelas/${id}/siswa`);
    },
    onError: () => {
      showToast({
        title: "Gagal menambahkan siswa",
        description: "Terjadi kesalahan saat menambahkan siswa.",
        color: "error",
      });
    },
  });

  const handleSelect = (siswaId: string) => {
    setSelectedIds((prev) =>
      prev.includes(siswaId)
        ? prev.filter((id) => id !== siswaId)
        : [...prev, siswaId]
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader
        title="Assign Siswa ke Kelas"
        description="Pilih siswa yang ingin ditambahkan ke kelas ini"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Kelas", href: "/admin/kelas" },
          { label: "Siswa", href: `/admin/kelas/${id}/siswa` },
          { label: "Assign" },
        ]}
        backHref={`/admin/kelas/${id}/siswa`}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <Table
          aria-label="Tabel Siswa"
          isStriped
          removeWrapper
          classNames={{
            table: "min-w-full",
          }}
        >
          <TableHeader>
            <TableColumn>Nama</TableColumn>
            <TableColumn>Jenis Kelamin</TableColumn>
            <TableColumn>NIS</TableColumn>
            <TableColumn>NISN</TableColumn>
            <TableColumn>Orang Tua</TableColumn>
            <TableColumn>Pilih</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Tidak ada siswa ditemukan.">
            {siswaList.map((siswa: any) => (
              <TableRow key={siswa.id}>
                <TableCell>
                  {[siswa.namaDepan, siswa.namaTengah, siswa.namaBelakang]
                    .filter(Boolean)
                    .join(" ")}
                </TableCell>
                <TableCell>
                  {siswa.jenisKelamin === "LAKI_LAKI"
                    ? "Laki-laki"
                    : "Perempuan"}
                </TableCell>
                <TableCell>{siswa.nis || "-"}</TableCell>
                <TableCell>{siswa.nisn || "-"}</TableCell>
                <TableCell>{siswa.orangTua?.nama || "-"}</TableCell>
                <TableCell>
                  <Checkbox
                    isSelected={selectedIds.includes(siswa.id)}
                    onValueChange={() => handleSelect(siswa.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end pt-4">
        <Button
          color="primary"
          onClick={() => assignMutation.mutate()}
          isLoading={assignMutation.isPending}
          isDisabled={selectedIds.length === 0}
        >
          Tambahkan ke Kelas
        </Button>
      </div>
    </div>
  );
}
