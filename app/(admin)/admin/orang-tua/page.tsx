"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { ListGrid } from "@/components/ui/ListGrid";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { Button } from "@heroui/button";
import { showToast } from "@/utils/toastHelper";

import { getAllOrangTua, deleteOrangTua } from "@/services/orangTuaService";

export default function OrangTuaPage() {
  const router = useRouter();

  const { data: orangTua = [], isLoading } = useQuery({
    queryKey: ["orang-tua"],
    queryFn: getAllOrangTua,
  });

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "nama", label: "Nama" },
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Nomor HP" },
      { key: "actions", label: "Aksi", align: "center" as const },
    ];

    const rows = orangTua.map((item: any) => ({
      key: item.id,
      nama: item.nama,
      username: item.user?.username ?? "-",
      email: item.user?.email ?? "-",
      phoneNumber: item.user?.phoneNumber ?? "-",
      actions: (
        <TableActionsInline
          onEdit={() => router.push(`/admin/orang-tua/${item.id}/edit`)}
          onDelete={{
            onConfirm: async () => {
              try {
                await deleteOrangTua(item.id);
                showToast({
                  title: "Berhasil dihapus",
                  description: "Data orang tua berhasil dihapus.",
                  color: "success",
                });
              } catch (error) {
                showToast({
                  title: "Gagal menghapus",
                  description: "Terjadi kesalahan saat menghapus data orang tua.",
                  color: "error",
                });
              }
            },
          }}
          onView={() => router.push(`/admin/orang-tua/${item.id}`)}
        />
      ),
    }));

    return { columns, rows };
  }, [orangTua, router]);

  return (
    <ListGrid
      title="Manajemen Orang Tua"
      description="Kelola data orang tua dan akun user mereka."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Orang Tua" },
      ]}
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/admin/orang-tua/create")}
        >
          Tambah Orang Tua
        </Button>
      }
      columns={columns}
      rows={rows}
      loading={isLoading}
      searchPlaceholder="Cari orang tua..."
      showPagination
    />
  );
}
