"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllKelas } from "@/services/kelasService";
import { getAllGuruMapel } from "@/services/guruMapelService";
import { createJadwal } from "@/services/jadwalPelajaranService";
import { showToast } from "@/utils/toastHelper";
import { PageHeader } from "@/components/common/PageHeader";

const HARI_OPTIONS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function CreateJadwalPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { data: kelasList = [] } = useQuery({
    queryKey: ["kelas"],
    queryFn: getAllKelas,
  });

  const { data: guruMapelList = [] } = useQuery({
    queryKey: ["guru-mapel"],
    queryFn: getAllGuruMapel,
  });

  const createMutation = useMutation({
    mutationFn: createJadwal,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Jadwal pelajaran berhasil ditambahkan.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["jadwal-pelajaran"] });
      router.push("/admin/jadwal-pelajaran");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menambahkan jadwal.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: any) => {
    createMutation.mutate({
      kelasTahunAjaranId: data.kelasTahunAjaranId,
      guruMapelId: data.guruMapelId,
      hari: data.hari,
      jamKe: parseInt(data.jamKe),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <PageHeader
        title="Tambah Jadwal Pelajaran"
        description="Buat jadwal pelajaran baru untuk kelas."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Jadwal Pelajaran", href: "/admin/jadwal-pelajaran" },
          { label: "Tambah Jadwal" },
        ]}
        backHref="/admin/jadwal-pelajaran"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Kelas */}
        <div>
          <label className="block text-sm font-medium mb-1">Kelas</label>
          <Select
            {...register("kelasTahunAjaranId", {
              required: "Kelas wajib dipilih",
            })}
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

        {/* Hari */}
        <div>
          <label className="block text-sm font-medium mb-1">Hari</label>
          <Select
            {...register("hari", { required: "Hari wajib dipilih" })}
            isInvalid={!!errors.hari}
            errorMessage={errors.hari?.message as string}
          >
            {HARI_OPTIONS.map((hari) => (
              <SelectItem key={hari} textValue={hari}>
                {hari}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Jam Ke */}
        <div>
          <label className="block text-sm font-medium mb-1">Jam Ke</label>
          <Input
            type="number"
            min={1}
            {...register("jamKe", {
              required: "Jam ke wajib diisi",
              valueAsNumber: true,
            })}
            placeholder="Contoh: 1"
            isInvalid={!!errors.jamKe}
            errorMessage={errors.jamKe?.message as string}
          />
        </div>

        {/* Guru Mapel */}
        <div>
          <label className="block text-sm font-medium mb-1">Guru & Mapel</label>
          <Select
            {...register("guruMapelId", {
              required: "Guru mapel wajib dipilih",
            })}
            isInvalid={!!errors.guruMapelId}
            errorMessage={errors.guruMapelId?.message as string}
          >
            {guruMapelList.map((gm: any) => (
              <SelectItem key={gm.id} textValue={gm.id}>
                {gm.guru?.nama} - {gm.mataPelajaran?.nama}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="light" onPress={() => router.back()}>
            Batal
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={createMutation.isPending}
          >
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
