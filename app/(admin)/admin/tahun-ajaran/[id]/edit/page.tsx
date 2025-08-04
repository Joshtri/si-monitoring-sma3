"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Button, Checkbox } from "@heroui/react";
import { showToast } from "@/utils/toastHelper";
import {
  getTahunAjaranById,
  patchTahunAjaran,
} from "@/services/tahunAjaranService";
import { YearSelect } from "@/components/ui/inputs/YearSelect";

const schema = z.object({
  tahun: z.string().regex(/^\d{4}\/\d{4}$/, "Format harus 2025/2026"),
  aktif: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditTahunAjaranPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tahun: "",
      aktif: false,
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { isSubmitting },
  } = form;

  const { data } = useQuery({
    queryKey: ["tahun-ajaran", id],
    queryFn: () => getTahunAjaranById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      reset({
        tahun: data.tahun,
        aktif: data.aktif,
      });
    }
  }, [data, reset]);

  const tahunValue = useWatch({ control, name: "tahun" });

  const semesterDates = useMemo(() => {
    const match = tahunValue?.match(/^(\d{4})\/(\d{4})$/);
    if (!match) return null;

    const [_, start, end] = match;
    return {
      ganjil: {
        mulai: new Date(`${start}-07-01`),
        selesai: new Date(`${start}-12-31`),
      },
      genap: {
        mulai: new Date(`${end}-01-01`),
        selesai: new Date(`${end}-06-30`),
      },
    };
  }, [tahunValue]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => patchTahunAjaran(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tahun-ajaran"] });
      showToast({
        title: "Berhasil",
        description: "Tahun ajaran berhasil diperbarui.",
        color: "success",
      });
      router.push("/admin/tahun-ajaran");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui data.",
        color: "error",
      });
    },
  });

  const onSubmit = (values: FormValues) => mutation.mutate(values);

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          title="Edit Tahun Ajaran"
          description="Perbarui tahun ajaran yang dipilih."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Tahun Ajaran", href: "/admin/tahun-ajaran" },
            { label: "Edit Tahun Ajaran" },
          ]}
          backHref="/admin/tahun-ajaran"
        />
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-xl p-4 shadow-sm">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <YearSelect name="tahun" />

            <div className="flex items-center gap-2">
              <Checkbox {...register("aktif")} color="success" id="aktif" />
              <label htmlFor="aktif" className="text-sm text-gray-700">
                Tandai sebagai tahun ajaran aktif
              </label>
            </div>

            {semesterDates && (
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600 border">
                <p className="font-semibold mb-1">Periode Semester:</p>
                <ul className="space-y-1">
                  <li>
                    <strong>Semester Ganjil:</strong>{" "}
                    {format(semesterDates.ganjil.mulai, "dd MMMM yyyy", {
                      locale: idLocale,
                    })}{" "}
                    –{" "}
                    {format(semesterDates.ganjil.selesai, "dd MMMM yyyy", {
                      locale: idLocale,
                    })}
                  </li>
                  <li>
                    <strong>Semester Genap:</strong>{" "}
                    {format(semesterDates.genap.mulai, "dd MMMM yyyy", {
                      locale: idLocale,
                    })}{" "}
                    –{" "}
                    {format(semesterDates.genap.selesai, "dd MMMM yyyy", {
                      locale: idLocale,
                    })}
                  </li>
                </ul>
              </div>
            )}

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
