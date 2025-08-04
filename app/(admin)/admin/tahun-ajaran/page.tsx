"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { ListGrid } from "@/components/ui/ListGrid";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { Button, Chip } from "@heroui/react";

import {
  getAllTahunAjaran,
  deleteTahunAjaran,
  patchTahunAjaran,
} from "@/services/tahunAjaranService";

import { showToast } from "@/utils/toastHelper";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function TahunAjaranPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: tahunList = [], isLoading } = useQuery({
    queryKey: ["tahun-ajaran"],
    queryFn: getAllTahunAjaran,
  });

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "tahun", label: "Tahun Ajaran" },
      { key: "aktif", label: "Status", align: "center" as const },
      { key: "actions", label: "Aksi", align: "center" as const },
    ];

    const rows = tahunList.map((item: any) => ({
      key: item.id,
      tahun: item.tahun,
      aktif: (
        <Chip color={item.aktif ? "success" : "default"}>
          {item.aktif ? "Aktif" : "Nonaktif"}
        </Chip>
      ),
      actions: (
        <TableActionsInline
          onEdit={() => router.push(`/admin/tahun-ajaran/${item.id}/edit`)}
          onDelete={{
            onConfirm: async () => {
              try {
                await deleteTahunAjaran(item.id);
                queryClient.invalidateQueries({ queryKey: ["tahun-ajaran"] });
                showToast({
                  title: "Berhasil dihapus",
                  description: "Tahun ajaran telah dihapus.",
                  color: "success",
                });
              } catch {
                showToast({
                  title: "Gagal menghapus",
                  description: "Tidak dapat menghapus tahun ajaran.",
                  color: "error",
                });
              }
            },
          }}
          customActions={[
            {
              key: "aktifkan",
              label: "Aktifkan",
              show: !item.aktif, // ⬅️ tampilkan hanya jika belum aktif
              icon: CheckCircleIcon, // misalnya pakai icon ini
              color: "success",
              onClick: async () => {
                await patchTahunAjaran(item.id, { aktif: true });
                queryClient.invalidateQueries({ queryKey: ["tahun-ajaran"] });
              },
            },
          ]}
        />
      ),
    }));

    return { columns, rows };
  }, [tahunList, queryClient, router]);

  return (
    <ListGrid
      title="Manajemen Tahun Ajaran"
      description="Kelola daftar tahun ajaran yang tersedia di sistem."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Tahun Ajaran" },
      ]}
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/admin/tahun-ajaran/create")}
        >
          Tambah Tahun Ajaran
        </Button>
      }
      columns={columns}
      rows={rows}
      loading={isLoading}
      searchPlaceholder="Cari tahun ajaran..."
    />
  );
}
