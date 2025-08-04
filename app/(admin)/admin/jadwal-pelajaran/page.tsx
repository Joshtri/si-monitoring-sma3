"use client";

import { TableActionsInline } from "@/components/common/TableActionsInline";
import { ListGrid } from "@/components/ui/ListGrid";
import { deleteJadwal, getAllJadwal } from "@/services/jadwalPelajaranService";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toastHelper";

export default function JadwalPelajaranPage() {
  const router = useRouter();

  const { data: jadwalList = [], isLoading } = useQuery({
    queryKey: ["jadwal-pelajaran"],
    queryFn: getAllJadwal,
  });

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "kelas", label: "Kelas" },
      { key: "hari", label: "Hari" },
      { key: "jamKe", label: "Jam Ke" },
      { key: "guru", label: "Guru" },
      { key: "mapel", label: "Mapel" },
      { key: "actions", label: "Aksi", align: "center" as const },
    ];

    const rows = jadwalList.map((jadwal: any) => ({
      key: jadwal.id,
      kelas: jadwal.kelasTahunAjaran?.kelas ?? "-",
      hari: jadwal.hari,
      jamKe: jadwal.jamKe,
      guru: jadwal.guruMapel?.guru?.nama ?? "-",
      mapel: jadwal.guruMapel?.mataPelajaran?.nama ?? "-",
      actions: (
        <TableActionsInline
          onEdit={() => router.push(`/admin/jadwal-pelajaran/${jadwal.id}/edit`)}
          onDelete={{
            onConfirm: async () => {
              try {
                await deleteJadwal(jadwal.id);
                showToast({
                  title: "Berhasil dihapus",
                  description: "Jadwal pelajaran berhasil dihapus.",
                  color: "success",
                });
              } catch (error) {
                showToast({
                  title: "Gagal menghapus jadwal",
                  description: "Terjadi kesalahan saat menghapus data.",
                  color: "error",
                });
              }
            },
          }}
        />
      ),
    }));

    return { columns, rows };
  }, [jadwalList]);

  return (
    <ListGrid
      title="Manajemen Jadwal Pelajaran"
      description="Atur dan kelola jadwal pelajaran berdasarkan kelas, guru, dan jam ke."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Jadwal Pelajaran" },
      ]}
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/admin/jadwal-pelajaran/create")}
        >
          Tambah Jadwal
        </Button>
      }
      columns={columns}
      rows={rows}
      loading={isLoading}
      searchPlaceholder="Cari jadwal..."
      showPagination
    />
  );
}
