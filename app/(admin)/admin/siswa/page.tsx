"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

import { getAllSiswa, deleteSiswa } from "@/services/siswaService";
import { ListGrid } from "@/components/ui/ListGrid";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { showToast } from "@/utils/toastHelper";

export default function SiswaPage() {
  const router = useRouter();

  const { data: siswa = [], isLoading } = useQuery({
    queryKey: ["siswa"],
    queryFn: getAllSiswa,
  });

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "nama", label: "Nama" },
      { key: "nis", label: "NIS" },
      { key: "nisn", label: "NISN" },
      { key: "jenisKelamin", label: "Jenis Kelamin" },
      { key: "orangTua", label: "Orang Tua" },
      { key: "actions", label: "Aksi", align: "center" as const },
    ];

    const rows = siswa.map((s: any) => ({
      key: s.id,
      nama: `${s.namaDepan} ${s.namaTengah ?? ""} ${s.namaBelakang ?? ""}`.trim(),
      nis: s.nis ?? "-",
      nisn: s.nisn ?? "-",
      jenisKelamin: s.jenisKelamin.replace("_", " "),
      orangTua: s.orangTua?.nama ?? "-",
      actions: (
        <TableActionsInline
          onEdit={() => router.push(`/admin/siswa/${s.id}/edit`)}
          onDelete={{
            onConfirm: async () => {
              try {
                await deleteSiswa(s.id);
                showToast({
                  title: "Siswa berhasil dihapus",
                  description: "Data siswa telah dihapus.",
                  color: "success",
                });
              } catch (error) {
                showToast({
                  title: "Gagal menghapus siswa",
                  description: "Terjadi kesalahan saat menghapus data siswa.",
                  color: "error",
                });
              }
            },
          }}
          onView={() => router.push(`/admin/siswa/${s.id}`)}
        />
      ),
    }));

    return { columns, rows };
  }, [siswa]);

  return (
    <ListGrid
      title="Manajemen Siswa"
      description="Kelola data siswa, identitas, dan relasi orang tua."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Siswa" },
      ]}
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/admin/siswa/create")}
        >
          Tambah Siswa
        </Button>
      }
      columns={columns}
      rows={rows}
      loading={isLoading}
      searchPlaceholder="Cari siswa..."
      showPagination
    />
  );
}
