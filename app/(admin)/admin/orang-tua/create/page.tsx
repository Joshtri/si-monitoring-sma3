"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { Button } from "@heroui/react";
import { showToast } from "@/utils/toastHelper";
import { createOrangTua } from "@/services/orangTuaService";

// ✅ Validasi Zod
const createOrangTuaSchema = z.object({
  username: z.string().min(3, "Minimal 3 karakter"),
  password: z.string().min(6, "Minimal 6 karakter"),
  email: z.string().email("Email tidak valid"),
  phoneNumber: z.string().optional(),
  nama: z.string().min(3, "Nama lengkap wajib diisi"),
});

type OrangTuaFormValues = z.infer<typeof createOrangTuaSchema>;

export default function CreateOrangTuaPage() {
  const router = useRouter();

  const form = useForm<OrangTuaFormValues>({
    resolver: zodResolver(createOrangTuaSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      nama: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: OrangTuaFormValues) => {
    try {
      await createOrangTua(data);
      showToast({
        title: "Orang Tua berhasil ditambahkan",
        description: "Akun dan data orang tua telah dibuat.",
        color: "success",
      });
      router.push("/admin/orang-tua");
    } catch (error) {
      showToast({
        title: "Gagal menambahkan orang tua",
        description: "Terjadi kesalahan saat menyimpan data.",
        color: "error",
      });
    }
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          title="Tambah Orang Tua"
          description="Buat akun dan data orang tua baru."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Orang Tua", href: "/admin/orang-tua" },
            { label: "Tambah Orang Tua" },
          ]}
          backHref="/admin/orang-tua"
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
              label="Nama Lengkap Orang Tua"
              placeholder="Nama lengkap"
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
