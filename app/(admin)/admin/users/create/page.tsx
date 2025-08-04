"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { AutocompleteInput } from "@/components/ui/inputs/AutocompleteInput";
import { Button } from "@heroui/react";
import { showToast } from "@/utils/toastHelper";
import { createUser } from "@/services/usersService"; // ✅ make sure this is correct
import { Roles } from "@/constants/common";

const userSchema = z.object({
  username: z.string().min(3, "Minimal 3 karakter"),
  password: z.string().min(6, "Minimal 6 karakter"),
  email: z.string().email("Email tidak valid"),
  phoneNumber: z.string().optional(),
  role: z.enum(["ADMIN", "GURU", "WALI_KELAS", "ORANG_TUA"]),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsersCreatePage() {
  const router = useRouter();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      role: "ADMIN",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUser(data);
      showToast({
        title: "Pengguna berhasil ditambahkan",
        description: "Pengguna baru telah berhasil dibuat.",
        color: "success",
      });
      router.push("/admin/users");
    } catch (error) {
      showToast({
        title: "Gagal menambahkan pengguna",
        description: "Terjadi kesalahan saat menambahkan pengguna.",
        color: "error",
      });
    }
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          title="Tambah Pengguna"
          description="Buat akun pengguna baru."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Users", href: "/admin/users" },
            { label: "Tambah Pengguna" },
          ]}
          backHref="/admin/users"
        />
      </div>

      <div className="max-w-5xl mx-auto p-4 bg-white rounded-xl shadow-sm mt-6">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput
              name="username"
              label="Username"
              placeholder="Masukkan username"
            />
            <TextInput
              name="password"
              label="Password"
              placeholder="Masukkan password"
            />
            <TextInput
              name="email"
              label="Email"
              placeholder="contoh@email.com"
            />
            <TextInput
              name="phoneNumber"
              label="Nomor HP"
              placeholder="08xxxxxxxxxx"
            />
            <AutocompleteInput name="role" label="Role" options={Roles} />

            <div className="pt-4">
              <Button
                type="submit"
                color="primary"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                Simpan
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
