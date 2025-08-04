"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { Button, Checkbox } from "@heroui/react";
import { showToast } from "@/utils/toastHelper";
import { createTahunAjaran } from "@/services/tahunAjaranService";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { YearSelect } from "@/components/ui/inputs/YearSelect";

// zod schema
const schema = z.object({
  tahun: z.string().regex(/^\d{4}\/\d{4}$/, "Format tahun harus 2025/2026"),
  aktif: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CreateTahunAjaranPage() {
  const router = useRouter();

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
    formState: { isSubmitting },
    control,
  } = form;

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

  const onSubmit = async (data: FormValues) => {
    try {
      await createTahunAjaran(data);
      showToast({
        title: "Berhasil",
        description: "Tahun ajaran berhasil ditambahkan.",
        color: "success",
      });
      router.push("/admin/tahun-ajaran");
    } catch {
      showToast({
        title: "Gagal",
        description: "Tidak dapat menambahkan tahun ajaran.",
        color: "error",
      });
    }
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          title="Tambah Tahun Ajaran"
          description="Form untuk menambahkan tahun ajaran baru."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Tahun Ajaran", href: "/admin/tahun-ajaran" },
            { label: "Tambah" },
          ]}
          backHref="/admin/tahun-ajaran"
        />
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl p-4 shadow-sm">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* <TextInput
              name="tahun"
              label="Tahun Ajaran"
              placeholder="Contoh: 2025/2026"
            /> */}

            <YearSelect name="tahun" />

            <div className="flex items-center gap-2">
              <Checkbox
                {...register("aktif")}
                color="success"
                id="aktif"
                defaultSelected
              />
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
