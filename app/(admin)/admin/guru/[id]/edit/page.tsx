"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { Button } from "@heroui/react";

import { editGuruSchema } from "@/validations/guruSchema";
import { getGuruById, updateGuruWithUser } from "@/services/guruService";
import { showToast } from "@/utils/toastHelper";
import { GuruWithUser } from "@/interfaces/guru";

type EditGuruValues = z.infer<typeof editGuruSchema>;

export default function GuruEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<EditGuruValues>({
    resolver: zodResolver(editGuruSchema),
    defaultValues: {
      id: "",
      nama: "",
      nip: "",
      user: {
        id: "",
        username: "",
        email: "",
        phoneNumber: "",
      },
    },
  });

  const { reset } = form;

  const { data: guru, isLoading } = useQuery<GuruWithUser>({
    queryKey: ["guru", id],
    queryFn: () => getGuruById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (guru) {
      reset(guru);
    }
  }, [guru, reset]);

  const mutation = useMutation({
    mutationFn: updateGuruWithUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guru"] });
      showToast({
        title: "Berhasil",
        description: "Data guru berhasil diperbarui.",
        color: "success",
      });
      router.push("/admin/guru");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal memperbarui data guru.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: EditGuruValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        title="Edit Data Guru"
        backHref="/admin/gurus"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Guru", href: "/admin/gurus" },
          { label: "Edit Guru" },
        ]}
      />

      <div className="max-w-5xl mx-auto p-4 bg-white rounded-xl shadow-sm">
        {isLoading ? (
          <p className="text-center">Memuat data...</p>
        ) : (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ReadOnlyInput label="User ID" value={guru?.user?.id} />
              <TextInput name="user.username" label="Username" />
              <TextInput name="user.email" label="Email" />
              <TextInput name="user.phoneNumber" label="Nomor HP" />
              <TextInput name="nama" label="Nama Lengkap Guru" />
              <TextInput name="nip" label="NIP" />

              <div className="pt-4">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={mutation.isPending}
                  isDisabled={mutation.isPending}
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
