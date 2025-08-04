"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { AutocompleteInput } from "@/components/ui/inputs/AutocompleteInput";
import { Button } from "@heroui/react";

import { getUserById, updateUser } from "@/services/usersService";
import { showToast } from "@/utils/toastHelper";
import { Roles } from "@/constants/common";
import { User } from "@/interfaces/users";

// === Validation Schema ===
const userSchema = z.object({
  username: z.string().min(3, "Minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phoneNumber: z.string().optional(),
  role: z.enum(["ADMIN", "GURU", "WALI_KELAS", "ORANG_TUA"]),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsersEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // === Setup Form ===
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      role: "ORANG_TUA",
    },
  });

  // === Fetch User by ID ===
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  // === Reset form setelah data berhasil dimuat ===
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        role: user.role,
      });
    }
  }, [user, form]);

  // === Handle Submit ===
  const mutation = useMutation({
    mutationFn: (data: UserFormValues) => updateUser(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showToast({
        title: "Berhasil",
        description: "Data pengguna berhasil diperbarui.",
        color: "success",
      });
      router.push("/admin/users");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal memperbarui data pengguna.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: UserFormValues) => {
    mutation.mutate(data);
  };

  // === Render ===
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        title="Edit Pengguna"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Pengguna", href: "/admin/users" },
          { label: "Edit Pengguna" },
        ]}
        backHref="/admin/users"
      />

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm">
        {isLoading ? (
          <p className="text-center">Memuat data...</p>
        ) : (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TextInput name="username" label="Username" />
              <TextInput name="email" label="Email" />
              <TextInput name="phoneNumber" label="Nomor HP" />
              <AutocompleteInput name="role" label="Role" options={Roles} />

              <div className="pt-4">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={mutation.isPending}
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
}
