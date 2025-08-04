// app/(admin)/kelas/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { ListGrid } from "@/components/ui/ListGrid";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { Button } from "@heroui/react";
import { UserIcon } from "@heroicons/react/24/outline";

import {
  getAllKelas,
  deleteKelas,
  patchKelas,
} from "@/services/kelasService";
import { showToast } from "@/utils/toastHelper";

export default function KelasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: kelasList = [], isLoading } = useQuery({
    queryKey: ["kelas"],
    queryFn: getAllKelas,
  });

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "kelas", label: "Nama Kelas" },
      { key: "tahunAjaran", label: "Tahun Ajaran" },
      { key: "waliKelas", label: "Wali Kelas" },
      { key: "actions", label: "Aksi", align: "center" as const },
    ];

    const rows = kelasList.map((item: any) => ({
      key: item.id,
      kelas: item.kelas,
      tahunAjaran: item.tahunAjaran?.tahun ?? "-",
      waliKelas: item.waliKelas?.nama ?? "-",
      actions: (
        <TableActionsInline
          onEdit={() => router.push(`/admin/kelas/${item.id}/edit`)}
          onDelete={{
            onConfirm: async () => {
              try {
                await deleteKelas(item.id);
                queryClient.invalidateQueries({ queryKey: ["kelas"] });
                showToast({
                  title: "Berhasil dihapus",
                  description: "Data kelas berhasil dihapus.",
                  color: "success",
                });
              } catch {
                showToast({
                  title: "Gagal menghapus",
                  description: "Tidak dapat menghapus data kelas.",
                  color: "error",
                });
              }
            },
          }}
          customActions={[
            {
              key: "detail",
              label: "Lihat Siswa",
              icon: UserIcon,
              onClick: () => {
                router.push(`/admin/kelas/${item.id}/siswa`);
              },
            },
          ]}
        />
      ),
    }));

    return { columns, rows };
  }, [kelasList, queryClient, router]);

  return (
    <ListGrid
      title="Manajemen Kelas"
      description="Kelola daftar kelas berdasarkan tahun ajaran aktif."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Kelas" },
      ]}
      actions={
        <Button color="primary" onPress={() => router.push("/admin/kelas/create")}>
          Tambah Kelas
        </Button>
      }
      columns={columns}
      rows={rows}
      loading={isLoading}
      searchPlaceholder="Cari nama kelas..."
    />
  );
}
