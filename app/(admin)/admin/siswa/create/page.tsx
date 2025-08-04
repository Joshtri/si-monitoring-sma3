// file: app/(admin)/siswa/create/page.tsx

"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { AutocompleteInput } from "@/components/ui/inputs/AutocompleteInput";
import { Button } from "@heroui/react";

import { showToast } from "@/utils/toastHelper";
import { createSiswa } from "@/services/siswaService";
import { useQuery } from "@tanstack/react-query";
import { getAllOrangTua } from "@/services/orangTuaService";

const schema = z.object({
  namaDepan: z.string().min(1, "Wajib diisi"),
  namaTengah: z.string().optional(),
  namaBelakang: z.string().optional(),
  nis: z.string().optional(),
  nisn: z.string().optional(),
  jenisKelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  alamat: z.string().optional(),
  orangTuaId: z.string().min(1, "Wajib dipilih"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateSiswaPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      namaDepan: "",
      namaTengah: "",
      namaBelakang: "",
      nis: "",
      nisn: "",
      jenisKelamin: "LAKI_LAKI",
      alamat: "",
      orangTuaId: "",
    },
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const { data: orangTuaList = [], isLoading } = useQuery({
    queryKey: ["orang-tua"],
    queryFn: getAllOrangTua,
  });

  const orangTuaOptions = orangTuaList.map((ot: any) => ({
    label: ot.nama,
    value: ot.id,
  }));

  const onSubmit = async (data: FormValues) => {
    try {
      await createSiswa(data);
      showToast({
        title: "Siswa berhasil ditambahkan",
        description: "Data siswa telah disimpan.",
        color: "success",
      });
      router.push("/admin/siswa");
    } catch (error) {
      showToast({
        title: "Gagal menambahkan siswa",
        description: "Terjadi kesalahan saat menyimpan data.",
        color: "error",
      });
    }
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          title="Tambah Siswa"
          description="Form untuk menambahkan data siswa baru."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Siswa", href: "/admin/siswa" },
            { label: "Tambah Siswa" },
          ]}
          backHref="/admin/siswa"
        />
      </div>

      <div className="max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-sm mt-6">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 3 kolom untuk nama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput name="namaDepan" label="Nama Depan" />
              <TextInput name="namaTengah" label="Nama Tengah" />
              <TextInput name="namaBelakang" label="Nama Belakang" />
            </div>

            {/* 2 kolom untuk nis dan nisn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput name="nis" label="NIS" />
              <TextInput name="nisn" label="NISN" />
            </div>

            {/* Sisanya 1 kolom */}
            <TextInput name="alamat" label="Alamat" />

            <AutocompleteInput
              name="jenisKelamin"
              label="Jenis Kelamin"
              options={[
                { label: "Laki-laki", value: "LAKI_LAKI" },
                { label: "Perempuan", value: "PEREMPUAN" },
              ]}
            />

            <AutocompleteInput
              name="orangTuaId"
              label="Orang Tua"
              options={orangTuaOptions}
              isLoading={isLoading}
              placeholder="Pilih orang tua siswa"
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
