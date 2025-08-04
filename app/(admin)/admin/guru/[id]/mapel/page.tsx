"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";

import { ListGrid } from "@/components/ui/ListGrid";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { Button, Chip } from "@heroui/react";

import {
  getMapelByGuru,
  assignMapelToGuru,
  deleteMapelFromGuru,
} from "@/services/guruMapelService";
import { getAllMataPelajaran } from "@/services/mataPelajaranService";

import { showToast } from "@/utils/toastHelper";

export default function GuruMapelPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedMapel, setSelectedMapel] = useState<string | null>(null);

  const { data: guruMapel = [], isLoading } = useQuery({
    queryKey: ["guru-mapel", id],
    queryFn: () => getMapelByGuru(id),
  });

  const { data: allMapel = [] } = useQuery({
    queryKey: ["mata-pelajaran"],
    queryFn: getAllMataPelajaran,
  });

  const assignMutation = useMutation({
    mutationFn: (mapelId: string) => assignMapelToGuru(id, mapelId),
    onSuccess: () => {
      showToast({ title: "Mapel ditambahkan", color: "success" });
      queryClient.invalidateQueries({ queryKey: ["guru-mapel", id] });
      setSelectedMapel(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (mapelId: string) => deleteMapelFromGuru(id, mapelId),
    onSuccess: () => {
      showToast({ title: "Mapel dihapus", color: "success" });
      queryClient.invalidateQueries({ queryKey: ["guru-mapel", id] });
    },
  });

  const availableMapel = allMapel.filter(
    (mapel: any) => !guruMapel.some((gm: any) => gm.id === mapel.id)
  );

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "nama", label: "Nama Mapel" },
      { key: "aksi", label: "Aksi", align: "center" as const },
    ];

    const rows = guruMapel.map((item: any) => ({
      key: item.id,
      nama: item.nama,
      aksi: (
        <TableActionsInline
          onDelete={{
            onConfirm: () => deleteMutation.mutate(item.id),
          }}
        />
      ),
    }));

    return { columns, rows };
  }, [guruMapel]);

  return (
    <ListGrid
      title="Kelola Mapel Guru"
      backHref="/admin/guru"
      description="Daftar mata pelajaran yang diajar oleh guru ini."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Guru", href: "/admin/guru" },
        { label: "Kelola Mapel" },
      ]}
      actions={
        <div className="flex items-center gap-4">
          <select
            value={selectedMapel ?? ""}
            onChange={(e) => setSelectedMapel(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="" disabled>
              Pilih mata pelajaran...
            </option>
            {availableMapel.map((mapel: any) => (
              <option key={mapel.id} value={mapel.id}>
                {mapel.nama}
              </option>
            ))}
          </select>
          <Button
            color="primary"
            isDisabled={!selectedMapel}
            onPress={() => {
              if (selectedMapel && selectedMapel !== "") {
                assignMutation.mutate(selectedMapel);
              } else {
                showToast({
                  title: "Pilih mata pelajaran terlebih dahulu",
                  color: "warning",
                });
              }
            }}
          >
            Tambah Mapel
          </Button>
        </div>
      }
      columns={columns}
      rows={rows}
      loading={isLoading}
      searchPlaceholder="Cari mapel..."
    />
  );
}
