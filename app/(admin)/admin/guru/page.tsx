"use client";

import { TableActionsInline } from "@/components/common/TableActionsInline";
import { ListGrid } from "@/components/ui/ListGrid";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toastHelper";
import { getAllGuru, deleteGuru } from "@/services/guruService";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function GuruPage() {
  const router = useRouter();

  const { data: guru = [], isLoading } = useQuery({
    queryKey: ["guru"],
    queryFn: getAllGuru,
  });

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "nama", label: "Nama" },
      { key: "nip", label: "NIP" },
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "actions", label: "Aksi", align: "center" as const },
    ];

    const rows = guru.map((guru: any) => ({
      key: guru.id,
      nama: guru.nama,
      nip: guru.nip,
      username: guru.user?.username ?? "-",
      email: guru.user?.email ?? "-",
      actions: (
        <TableActionsInline
          onEdit={() => router.push(`/admin/guru/${guru.id}/edit`)}
          onDelete={{
            onConfirm: async () => {
              try {
                await deleteGuru(guru.id);
                showToast({
                  title: "Guru berhasil dihapus",
                  description: "Data guru telah dihapus.",
                  color: "success",
                });
              } catch (error) {
                showToast({
                  title: "Gagal menghapus guru",
                  description: "Terjadi kesalahan saat menghapus data guru.",
                  color: "error",
                });
              }
            },
          }}
          onView={() => router.push(`/admin/guru/${guru.id}`)}
          customActions={[
            {
              key: "mapel",
              label: "Kelola Mapel",
              icon: BookOpenIcon, // Ganti dengan ikon yang sesuai
              onClick: () => router.push(`/admin/guru/${guru.id}/mapel`),
              color: "primary",
            },
          ]}
        />
      ),
    }));

    return { columns, rows };
  }, [guru]);

  return (
    <ListGrid
      title="Manajemen Guru"
      description="Kelola data guru, NIP, dan user akun mereka."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Guru" },
      ]}
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/admin/guru/create")}
        >
          Tambah Guru
        </Button>
      }
      columns={columns}
      rows={rows}
      loading={isLoading}
      searchPlaceholder="Cari guru..."
      showPagination
    />
  );
}
