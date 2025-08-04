"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { AutocompleteInput } from "@/components/ui/inputs/AutocompleteInput";
import { Button } from "@heroui/react";

import { showToast } from "@/utils/toastHelper";
import { getSiswaById, updateSiswa } from "@/services/siswaService";
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

export default function EditSiswaPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

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

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const { data: siswa } = useQuery({
    queryKey: ["siswa", id],
    queryFn: () => getSiswaById(id),
    enabled: !!id,
  });

  const { data: orangTuaList = [], isLoading } = useQuery({
    queryKey: ["orang-tua"],
    queryFn: getAllOrangTua,
  });

  const orangTuaOptions = orangTuaList.map((ot: any) => ({
    label: ot.nama,
    value: ot.id,
  }));

  useEffect(() => {
    if (siswa) {
      reset({
        namaDepan: siswa.namaDepan,
        namaTengah: siswa.namaTengah,
        namaBelakang: siswa.namaBelakang,
        nis: siswa.nis,
        nisn: siswa.nisn,
        jenisKelamin: siswa.jenisKelamin,
        alamat: siswa.alamat,
        orangTuaId: siswa.orangTuaId,
      });
    }
  }, [siswa, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => updateSiswa(id, data),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data siswa berhasil diperbarui.",
        color: "success",
      });
      router.push("/admin/siswa");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui data.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          title="Edit Siswa"
          description="Ubah data siswa yang dipilih."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Siswa", href: "/admin/siswa" },
            { label: "Edit Siswa" },
          ]}
          backHref="/admin/siswa"
        />
      </div>

      <div className="max-w-5xl mx-auto p-4 bg-white rounded-xl shadow-sm mt-6">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput name="namaDepan" label="Nama Depan" />
              <TextInput name="namaTengah" label="Nama Tengah" />
              <TextInput name="namaBelakang" label="Nama Belakang" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput name="nis" label="NIS" />
              <TextInput name="nisn" label="NISN" />
            </div>

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
                isLoading={isSubmitting || mutation.isPending}
                isDisabled={isSubmitting || mutation.isPending}
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
