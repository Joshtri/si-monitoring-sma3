"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { Button } from "@heroui/react";
import { showToast } from "@/utils/toastHelper";
import { createGuruWithUser } from "@/services/guruService";

// ✅ Validasi Zod
export const createGuruSchema = z.object({
  username: z.string().min(3, "Minimal 3 karakter"),
  password: z.string().min(6, "Minimal 6 karakter"),
  email: z.string().email("Email tidak valid"),
  phoneNumber: z.string().optional(),
  nama: z.string().min(3, "Nama wajib diisi"),
  nip: z.string().min(8, "NIP minimal 8 digit"),
});

type GuruFormValues = z.infer<typeof createGuruSchema>;

export default function CreateGuruPage() {
  const router = useRouter();

  const form = useForm<GuruFormValues>({
    resolver: zodResolver(createGuruSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      nama: "",
      nip: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: GuruFormValues) => {
    try {
      await createGuruWithUser(data);
      showToast({
        title: "Guru berhasil ditambahkan",
        description: "Akun dan data guru telah dibuat.",
        color: "success",
      });
      router.push("/admin/guru");
    } catch (error) {
      showToast({
        title: "Gagal menambahkan guru",
        description: "Terjadi kesalahan saat menyimpan data.",
        color: "error",
      });
    }
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          title="Tambah Guru"
          description="Buat akun dan data guru baru."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Guru", href: "/admin/guru" },
            { label: "Tambah Guru" },
          ]}
          backHref="/admin/guru"
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
              type="password"
              placeholder="Masukkan password"
            />
            <TextInput
              name="email"
              label="Email"
              type="email"
              placeholder="contoh@email.com"
            />
            <TextInput
              name="phoneNumber"
              label="Nomor HP"
              placeholder="08xxxxxxxxxx"
            />
            <TextInput
              name="nama"
              label="Nama Lengkap Guru"
              placeholder="Nama lengkap"
            />
            <TextInput
              name="nip"
              label="NIP"
              placeholder="Nomor Induk Pegawai"
            />

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
