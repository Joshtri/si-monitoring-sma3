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

import { orangTuaSchema } from "@/validations/orangTuaSchema";
import {
  getOrangTuaById,
  updateOrangTuaWithUser,
} from "@/services/orangTuaService";
import { showToast } from "@/utils/toastHelper";
import { OrangTuaWithUserAndAnak } from "@/interfaces/orang-tua";

type EditOrangTuaValues = z.infer<typeof orangTuaSchema>;

export default function OrangTuaEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<EditOrangTuaValues>({
    resolver: zodResolver(orangTuaSchema),
    defaultValues: {
      id: "",
      nama: "",
      user: {
        id: "",
        username: "",
        email: "",
        phoneNumber: "",
      },
    },
  });

  const { reset } = form;

  const { data: orangTua, isLoading } = useQuery<OrangTuaWithUserAndAnak>({
    queryKey: ["orang-tua", id],
    queryFn: () => getOrangTuaById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (orangTua) {
      reset(orangTua);
    }
  }, [orangTua, reset]);

  const mutation = useMutation({
    mutationFn: updateOrangTuaWithUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orang-tua"] });
      showToast({
        title: "Berhasil",
        description: "Data orang tua berhasil diperbarui.",
        color: "success",
      });
      router.push("/admin/orang-tua");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal memperbarui data orang tua.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: EditOrangTuaValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        title="Edit Orang Tua"
        backHref="/admin/orang-tua"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orang Tua", href: "/admin/orang-tua" },
          { label: "Edit Orang Tua" },
        ]}
      />

      <div className="max-w-5xl mx-auto p-4 bg-white rounded-xl shadow-sm">
        {isLoading ? (
          <p className="text-center">Memuat data...</p>
        ) : (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ReadOnlyInput label="User ID" value={orangTua?.user?.id} />
              <TextInput name="user.username" label="Username" />
              <TextInput name="user.email" label="Email" />
              <TextInput name="user.phoneNumber" label="Nomor HP" />
              <TextInput name="nama" label="Nama Lengkap Orang Tua" />

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
