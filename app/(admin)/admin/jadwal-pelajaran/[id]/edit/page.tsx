"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { getJadwalById, patchJadwal } from "@/services/jadwalPelajaranService";
import { getAllKelas } from "@/services/kelasService";
import { getAllGuruMapel } from "@/services/guruMapelService";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { showToast } from "@/utils/toastHelper";
import { PageHeader } from "@/components/common/PageHeader";

export default function EditJadwalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: jadwal, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["jadwal", id],
    queryFn: () => getJadwalById(id),
    enabled: !!id,
  });

  const { data: kelasList = [] } = useQuery({
    queryKey: ["kelas"],
    queryFn: getAllKelas,
  });

  const { data: guruMapelList = [] } = useQuery({
    queryKey: ["guru-mapel"],
    queryFn: getAllGuruMapel,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      kelasTahunAjaranId: "",
      guruMapelId: "",
      hari: "",
      jamKe: 1,
    },
  });

  useEffect(() => {
    if (jadwal) {
      setValue("kelasTahunAjaranId", jadwal.kelasTahunAjaranId);
      setValue("guruMapelId", jadwal.guruMapelId);
      setValue("hari", jadwal.hari);
      setValue("jamKe", jadwal.jamKe);
    }
  }, [jadwal, setValue]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => patchJadwal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal-pelajaran"] });
      showToast({
        title: "Jadwal diperbarui",
        description: "Data jadwal berhasil diperbarui.",
        color: "success",
      });
      router.push("/admin/jadwal-pelajaran");
    },
    onError: () => {
      showToast({
        title: "Gagal memperbarui",
        description: "Terjadi kesalahan saat update data.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <PageHeader
        title="Edit Jadwal Pelajaran"
        description="Perbarui jadwal pelajaran untuk kelas."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Jadwal Pelajaran", href: "/admin/jadwal-pelajaran" },
          { label: "Edit Jadwal" },
        ]}
        backHref="/admin/jadwal-pelajaran"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Kelas</label>
          <Select
            {...register("kelasTahunAjaranId", {
              required: "Kelas wajib dipilih",
            })}
            defaultSelectedKeys={[jadwal?.kelasTahunAjaranId]}
            isInvalid={!!errors.kelasTahunAjaranId}
            errorMessage={errors.kelasTahunAjaranId?.message as string}
          >
            {kelasList.map((kelas: any) => (
              <SelectItem key={kelas.id} textValue={kelas.id}>
                {kelas.kelas}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Guru - Mata Pelajaran</label>
          <Select
            {...register("guruMapelId", {
              required: "Guru dan mapel wajib dipilih",
            })}
            defaultSelectedKeys={[jadwal?.guruMapelId]}
            isInvalid={!!errors.guruMapelId}
            errorMessage={errors.guruMapelId?.message as string}
          >
            {guruMapelList.map((gm: any) => (
              <SelectItem key={gm.id} textValue={gm.id}>
                {gm.guru.nama} - {gm.mataPelajaran.nama}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Hari</label>
          <Input
            {...register("hari", { required: "Hari wajib diisi" })}
            placeholder="Contoh: Senin"
            isInvalid={!!errors.hari}
            errorMessage={errors.hari?.message as string}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Jam ke-</label>
          <Input
            type="number"
            {...register("jamKe", {
              required: "Jam ke- wajib diisi",
              min: 1,
            })}
            placeholder="1"
            isInvalid={!!errors.jamKe}
            errorMessage={errors.jamKe?.message as string}
          />
        </div>

        <Button
          type="submit"
          color="primary"
          isLoading={updateMutation.isPending}
        >
          Simpan Perubahan
        </Button>
      </form>
    </div>
  );
}
