"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ListGrid } from "@/components/ui/ListGrid";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { Button, Chip } from "@heroui/react";
import { MataPelajaranModalForm } from "@/components/MataPelajaran/ModalFormMataPelajaran";

import {
  getAllMataPelajaran,
  deleteMataPelajaran,
  updateMataPelajaran,
  createMataPelajaran,
} from "@/services/mataPelajaranService";

import { showToast } from "@/utils/toastHelper";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ListMataPelajaranPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState(null);

  const { data: mapelList = [], isLoading } = useQuery({
    queryKey: ["mata-pelajaran"],
    queryFn: getAllMataPelajaran,
  });

  const createMutation = useMutation({
    mutationFn: (data: { nama: string; aktif: boolean }) =>
      createMataPelajaran(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-pelajaran"] });
      showToast({
        title: "Berhasil",
        description: "Mata pelajaran ditambahkan.",
        color: "success",
      });
      setShowModal(false);
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal menambahkan mata pelajaran.",
        color: "error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; nama: string; aktif: boolean }) =>
      updateMataPelajaran(data.id, { nama: data.nama, aktif: data.aktif }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-pelajaran"] });
      showToast({
        title: "Berhasil",
        description: "Mata pelajaran diperbarui.",
        color: "success",
      });
      setShowEditModal(false);
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal memperbarui mata pelajaran.",
        color: "error",
      });
    },
  });

  console.log("SHOW MODAL?", showModal);

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "nama", label: "Nama Mata Pelajaran" },
      { key: "aktif", label: "Status", align: "center" as const },
      { key: "actions", label: "Aksi", align: "center" as const },
    ];

    const rows = mapelList.map((item: any) => ({
      key: item.id,
      nama: item.nama,
      aktif: (
        <Chip color={item.aktif ? "success" : "default"}>
          {item.aktif ? "Aktif" : "Nonaktif"}
        </Chip>
      ),
      actions: (
        <TableActionsInline
          onEdit={() => {
            setSelectedMapel(item);
            setShowEditModal(true);
          }}
          onDelete={{
            onConfirm: async () => {
              try {
                await deleteMataPelajaran(item.id);
                queryClient.invalidateQueries({ queryKey: ["mata-pelajaran"] });
                showToast({
                  title: "Berhasil dihapus",
                  description: "Mata pelajaran telah dihapus.",
                  color: "success",
                });
              } catch {
                showToast({
                  title: "Gagal menghapus",
                  description:
                    "Terjadi kesalahan saat menghapus mata pelajaran.",
                  color: "error",
                });
              }
            },
          }}
          customActions={[
            {
              key: "aktifkan",
              label: "Aktifkan",
              show: !item.aktif,
              icon: CheckCircleIcon,
              color: "success",
              onClick: async () => {
                await updateMataPelajaran(item.id, { aktif: true });
                queryClient.invalidateQueries({ queryKey: ["mata-pelajaran"] });
              },
            },
          ]}
        />
      ),
    }));

    return { columns, rows };
  }, [mapelList, queryClient, router]);

  return (
    <>
      <ListGrid
        title="Manajemen Mata Pelajaran"
        description="Kelola daftar mata pelajaran yang tersedia di sistem."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Mata Pelajaran" },
        ]}
        actions={
          <Button color="primary" onPress={() => setShowModal(true)}>
            Tambah Mata Pelajaran
          </Button>
        }
        columns={columns}
        rows={rows}
        loading={isLoading}
        searchPlaceholder="Cari mata pelajaran..."
      />

      <MataPelajaranModalForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
        mode="create"
      />

      <MataPelajaranModalForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={(data) =>
          updateMutation.mutate({ id: selectedMapel?.id, ...data })
        }
        isLoading={updateMutation.isPending}
        mode="edit"
        defaultValues={{
          nama: selectedMapel?.nama ?? "",
          aktif: selectedMapel?.aktif ?? true,
        }}
      />
    </>
  );
}
