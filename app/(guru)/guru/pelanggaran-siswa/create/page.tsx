"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getSiswaWaliKelas, createPelanggaran } from "@/services/guruService";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  DateInput,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { useState } from "react";
import { parseDate, DateValue } from "@internationalized/date";
import { showToast } from "@/utils/toastHelper";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";

export const JENIS_PELANGGARAN_OPTIONS = [
  {
    key: "tugas",
    label: "Tidak Mengerjakan Tugas",
    description: "Siswa tidak menyelesaikan tugas yang diberikan.",
  },
  {
    key: "terlambat",
    label: "Terlambat Masuk Sekolah",
    description: "Siswa datang setelah jam masuk sekolah dimulai.",
  },
  {
    key: "bolos",
    label: "Membolos",
    description: "Siswa tidak hadir tanpa keterangan.",
  },
  {
    key: "barang_terlarang",
    label: "Membawa Barang Terlarang",
    description: "Membawa barang seperti rokok, senjata tajam, dll.",
  },
  {
    key: "berkelahi",
    label: "Bertengkar / Berkelahi",
    description: "Melakukan tindakan kekerasan fisik terhadap siswa lain.",
  },
  {
    key: "pakaian",
    label: "Berpakaian Tidak Sesuai",
    description: "Seragam tidak sesuai aturan sekolah.",
  },
  {
    key: "hp",
    label: "Menggunakan HP Saat Pelajaran",
    description: "Siswa menggunakan HP tanpa izin guru.",
  },
  {
    key: "tidak_upacara",
    label: "Tidak Mengikuti Upacara",
    description: "Siswa absen dari upacara tanpa alasan.",
  },
  {
    key: "lainnya",
    label: "Lainnya",
    description: "Jenis pelanggaran lainnya yang tidak disebutkan.",
  },
];

export default function CreatePelanggaranPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["siswa-wali"],
    queryFn: getSiswaWaliKelas,
  });

  const router = useRouter();
  const siswaList = data?.data ?? [];

  const siswaOptions = siswaList.map((siswa: any) => ({
    key: siswa.id,
    label: `${siswa.nama} – ${siswa.kelas}`,
  }));

  const [form, setForm] = useState<{
    siswaId: string;
    jenisPelanggaran: string;
    poin: number;
    tindakan: string;
    tanggal: DateValue | null;
  }>({
    siswaId: "",
    jenisPelanggaran: "",
    poin: 0,
    tindakan: "",
    tanggal: parseDate(new Date().toISOString().slice(0, 10)),
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await createPelanggaran(data);
    },
    onSuccess: () => {
      showToast({
        title: "Pelanggaran berhasil ditambahkan",
        description: "Data pelanggaran siswa telah disimpan.",
        color: "success",
      });

      setForm({
        siswaId: "",
        jenisPelanggaran: "",
        poin: 0,
        tindakan: "",
        tanggal: parseDate(new Date().toISOString().slice(0, 10)),
      });
      router.push("/guru/pelanggaran-siswa");
    },
    onError: (error: any) => {
      console.error("CREATE PELANGGARAN ERROR:", error);
      showToast({
        title: "Gagal menambahkan pelanggaran",
        description: error?.response?.data?.message || "Terjadi kesalahan",
        color: "error",
      });
    },
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.siswaId || !form.jenisPelanggaran || !form.tanggal) {
      showToast({
        title: "Form tidak lengkap",
        description: "Pastikan semua field telah diisi.",
        color: "warning",
      });
      return;
    }

    mutation.mutate({
      siswaId: form.siswaId,
      jenisPelanggaran: form.jenisPelanggaran,
      poin: form.poin,
      tindakan: form.tindakan,
      tanggal: form.tanggal?.toDate()?.toISOString(),
    });
  };

  return (
    <>
    <PageHeader
        title="Tambah Pelanggaran Siswa"
        breadcrumbs={[
            { label: "Guru", href: "/guru" },
            { label: "Pelanggaran Siswa", href: "/guru/pelanggaran-siswa" },
        ]}
        backHref="/guru/pelanggaran-siswa"
    />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-gray-800">
              Tambah Pelanggaran Siswa
            </h2>
            <p className="text-sm text-gray-500">
              Hanya untuk siswa dari kelas yang Anda asuh.
            </p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Autocomplete
            label="Pilih Siswa"
            placeholder="Cari nama siswa"
            selectedKey={form.siswaId || null}
            onSelectionChange={(key) => handleChange("siswaId", key as string)}
            isLoading={isLoading}
          >
            {siswaOptions.map((siswa) => (
              <AutocompleteItem key={siswa.key} textValue={siswa.label}>
                {siswa.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Autocomplete
            label="Jenis Pelanggaran"
            placeholder="Pilih atau cari jenis pelanggaran"
            selectedKey={form.jenisPelanggaran || null}
            onSelectionChange={(key) =>
              handleChange("jenisPelanggaran", key as string)
            }
            defaultItems={JENIS_PELANGGARAN_OPTIONS}
          >
            {(item) => (
              <AutocompleteItem key={item.key} textValue={item.label}>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>

          <Input
            type="number"
            label="Poin Pelanggaran"
            value={form.poin.toString()}
            onChange={(e) => handleChange("poin", parseInt(e.target.value))}
          />

          <Textarea
            label="Tindakan / Catatan"
            value={form.tindakan}
            onChange={(e) => handleChange("tindakan", e.target.value)}
          />

          <DateInput
            label="Tanggal Pelanggaran"
            value={form.tanggal}
            onChange={(val) => handleChange("tanggal", val)}
          />

          <Button
            isLoading={mutation.isPending}
            onClick={handleSubmit}
            color="danger"
            className="w-full"
          >
            Simpan Pelanggaran
          </Button>
        </CardBody>
      </Card>
    </>
  );
}
