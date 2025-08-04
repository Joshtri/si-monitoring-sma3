"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

// import PageHeader from "@/components/common/PageHeader";
// import TextInput from "@/components/ui/inputs/TextInput";
// import AutocompleteInput from "@/components/ui/inputs/AutocompleteInput";

import { getKelasById, patchKelas } from "@/services/kelasService";
import { getAllTahunAjaran } from "@/services/tahunAjaranService";
import { getAllGuru } from "@/services/guruService"; // pastikan ini ada
import { showToast } from "@/utils/toastHelper";
import { Button } from "@heroui/react";
import { useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { AutocompleteInput } from "@/components/ui/inputs/AutocompleteInput";

const schema = z.object({
  kelas: z.string().min(1, "Nama kelas wajib diisi"),
  tahunAjaranId: z.string().min(1, "Tahun ajaran wajib dipilih"),
  waliKelasId: z.string().optional().nullable(),
});

export default function KelasEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      kelas: "",
      tahunAjaranId: "",
      waliKelasId: undefined,
    },
  });

  const { data: detail } = useQuery({
    queryKey: ["kelas", id],
    queryFn: () => getKelasById(id as string),
  });

  const { data: tahunList = [] } = useQuery({
    queryKey: ["tahun-ajaran"],
    queryFn: getAllTahunAjaran,
  });

  const { data: guruList = [] } = useQuery({
    queryKey: ["guru"],
    queryFn: getAllGuru,
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) =>
      patchKelas(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      showToast({
        title: "Berhasil disimpan",
        description: "Data kelas berhasil diperbarui.",
        color: "success",
      });
      router.push("/admin/kelas");
    },
    onError: () => {
      showToast({
        title: "Gagal menyimpan",
        description: "Periksa kembali data yang diisi.",
        color: "error",
      });
    },
  });

  useEffect(() => {
    if (detail) {
      form.reset({
        kelas: detail.kelas,
        tahunAjaranId: detail.tahunAjaranId,
        waliKelasId: detail.waliKelasId ?? undefined,
      });
    }
  }, [detail, form]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        title="Edit Kelas"
        description="Perbarui informasi kelas"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Kelas", href: "/admin/kelas" },
          { label: "Edit Kelas" },
        ]}
        backHref="/admin/kelas"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TextInput name="kelas" label="Nama Kelas" />
          <AutocompleteInput
            name="tahunAjaranId"
            label="Tahun Ajaran"
            options={tahunList.map((t: any) => ({
              label: t.tahun,
              value: t.id,
            }))}
          />
          <AutocompleteInput
            name="waliKelasId"
            label="Wali Kelas"
            options={guruList.map((g: any) => ({
              label: g.nama,
              value: g.id,
            }))}
            isClearable
          />

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
    </div>
  );
}
