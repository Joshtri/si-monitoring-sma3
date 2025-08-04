"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { TextInput } from "@/components/ui/inputs/TextInput";
import { AutocompleteInput } from "@/components/ui/inputs/AutocompleteInput";
import { showToast } from "@/utils/toastHelper";

import { createKelas } from "@/services/kelasService";
import { getAllTahunAjaran } from "@/services/tahunAjaranService";
import { getAllGuru } from "@/services/guruService";
import { PageHeader } from "@/components/common/PageHeader";

export default function CreateKelasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm();

  const { data: tahunList = [] } = useQuery({
    queryKey: ["tahun-ajaran"],
    queryFn: getAllTahunAjaran,
  });

  const { data: guruList = [] } = useQuery({
    queryKey: ["guru"],
    queryFn: getAllGuru,
  });

  const mutation = useMutation({
    mutationFn: createKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      showToast({
        title: "Berhasil",
        description: "Kelas baru berhasil ditambahkan.",
        color: "success",
      });
      router.push("/admin/kelas");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal menambahkan kelas.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      kelas: data.kelas,
      tahunAjaranId: data.tahunAjaranId,
      waliKelasId: data.waliKelasId || null,
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader
          title="Tambah Kelas"
          description="Form untuk menambahkan kelas baru"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Kelas", href: "/admin/kelas" },
            { label: "Tambah Kelas" },
          ]}
          backHref="/admin/kelas"
        />
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader>
                <h1 className="text-lg font-semibold">Tambah Kelas</h1>
              </CardHeader>
              <CardBody className="space-y-4">
                <TextInput name="kelas" label="Nama Kelas" required />

                <AutocompleteInput
                  name="tahunAjaranId"
                  label="Tahun Ajaran"
                  options={tahunList.map((t: any) => ({
                    label: t.tahun,
                    value: t.id,
                  }))}
                  required
                />

                <AutocompleteInput
                  name="waliKelasId"
                  label="Wali Kelas"
                  options={guruList.map((g: any) => ({
                    label: g.nama,
                    value: g.id,
                  }))}
                  placeholder="(Opsional)"
                  required={false}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={mutation.isPending}
                  >
                    Simpan
                  </Button>
                </div>
              </CardBody>
            </Card>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
