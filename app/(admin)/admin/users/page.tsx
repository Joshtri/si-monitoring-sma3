"use client";

import { TableActionsInline } from "@/components/common/TableActionsInline";
import { ListGrid } from "@/components/ui/ListGrid";
import { deleteUser, getUsers } from "@/services/usersService";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toastHelper";
export default function UsersPage() {
  const router = useRouter();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { columns, rows } = useMemo(() => {
    const columns = [
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "No HP" },
      { key: "role", label: "Role" },
      { key: "actions", label: "Aksi", align: "center" as const },
    ];

    const rows = users.map((user: any) => ({
      key: user.id,
      username: user.username,
      email: user.email ?? "-",
      phoneNumber: user.phoneNumber ?? "-",
      role: user.role.toLowerCase().replace("_", " "),
      actions: (
        <TableActionsInline
          onEdit={() => router.push(`/admin/users/${user.id}/edit`)}
          onDelete={{
            onConfirm: async () => {
              try {
                await deleteUser(user.id);
                showToast({
                  title: "Pengguna berhasil dihapus",
                  description: "Pengguna telah berhasil dihapus.",
                  color: "success",
                });
              } catch (error) {
                showToast({
                  title: "Gagal menghapus pengguna",
                  description: "Terjadi kesalahan saat menghapus pengguna.",
                  color: "error",
                });
              }
            },
          }}
          onView={() => router.push(`/admin/users/${user.id}`)}
        />
      ),
    }));

    return { columns, rows };
  }, [users]);

  return (
    <ListGrid
      title="Manajemen Pengguna"
      description="Kelola akun pengguna dan peran mereka di sistem."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Users" },
      ]}
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/admin/users/create")}
        >
          Tambah Pengguna
        </Button>
      }
      columns={columns}
      rows={rows}
      loading={isLoading}
      searchPlaceholder="Cari pengguna..."
      showPagination
    />
  );
}
