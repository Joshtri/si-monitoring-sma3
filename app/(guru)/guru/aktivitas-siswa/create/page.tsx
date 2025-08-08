"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Spinner,
  DateInput,
} from "@heroui/react";
import {
  DateValue,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";

import { useRouter } from "next/navigation";

import { showToast } from "@/utils/toastHelper";
    
const JENIS_AKTIVITAS_OPTIONS = [
  {
    key: "EKSTRAKURIKULER",
    label: "Ekstrakurikuler",
    description:
      "Kegiatan di luar jam pelajaran (pramuka, basket, paduan suara, dll.)",
  },
  {
    key: "ORGANISASI",
    label: "Organisasi",
    description: "OSIS, MPK, kepanitiaan, atau organisasi siswa lainnya.",
  },
  {
    key: "LOMBA",
    label: "Lomba",
    description: "Kompetisi internal/eksternal: sains, olahraga, seni, dll.",
  },
];

export default function CreateAktivitasSiswaPage() {
  const router = useRouter();

  // Form state
  const [siswaId, setSiswaId] = useState<string>("");
  const [namaKegiatan, setNamaKegiatan] = useState<string>("");
  const [jenis, setJenis] = useState<string>("");
  const [tanggal, setTanggal] = useState<DateValue | null>(
    parseDate(new Date().toISOString().slice(0, 10))
  ); // default hari ini
  const [catatan, setCatatan] = useState<string>("");

  // Fetch opsi siswa (wali kelas yang login)
  const {
    data: siswaOptions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["siswa-options-wali"],
    queryFn: async () => {
      const res = await axios.get("/api/guru/aktivitas-siswa/siswa-options");
      return res.data?.data ?? [];
    },
  });

  const { mutateAsync: createAktivitas, isPending } = useMutation({
    mutationFn: async () => {
      if (!siswaId) throw new Error("Siswa wajib dipilih");
      if (!namaKegiatan?.trim()) throw new Error("Nama kegiatan wajib diisi");
      if (!jenis) throw new Error("Jenis aktivitas wajib dipilih");
      if (!tanggal) throw new Error("Tanggal wajib dipilih");

      const jsDate = tanggal.toDate(getLocalTimeZone()); // konversi DateValue -> JS Date

      await axios.post("/api/guru/aktivitas-siswa", {
        siswaId,
        namaKegiatan: namaKegiatan.trim(),
        jenis,
        tanggal: jsDate, // backend terima DateTime
        catatan: catatan?.trim() || null,
      });
    },
    onSuccess: () => {
      // success UX terserah—di sini redirect balik ke list
      router.push("/guru/aktivitas-siswa");
    },
  });

  if (isLoading) return <Spinner className="mt-10 mx-auto" />;
  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        Gagal memuat daftar siswa.
      </p>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Tambah Aktivitas Siswa</h1>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Form Aktivitas</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Pilih Siswa"
            placeholder="Cari / pilih siswa"
            selectedKeys={siswaId ? [siswaId] : []}
            onSelectionChange={(keys) =>
              setSiswaId(Array.from(keys)[0] as string)
            }
          >
            {siswaOptions.map((s: any) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nama}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Nama Kegiatan"
            placeholder="Contoh: Lomba Matematika Provinsi"
            value={namaKegiatan}
            onChange={(e) => setNamaKegiatan(e.target.value)}
          />

          <Autocomplete
            label="Jenis Aktivitas"
            placeholder="Pilih jenis aktivitas"
            defaultItems={JENIS_AKTIVITAS_OPTIONS}
            selectedKey={jenis}
            onSelectionChange={(key) => setJenis(key as string)}
          >
            {(item) => (
              <AutocompleteItem
                key={item.key}
                value={item.key}
                description={item.description}
              >
                {item.label}
              </AutocompleteItem>
            )}
          </Autocomplete>

          <DateInput
            label="Tanggal"
            value={tanggal ?? undefined}
            onChange={setTanggal}
          />

          <Textarea
            label="Catatan (Opsional)"
            placeholder="Catatan tambahan…"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />

          <div className="flex gap-3 justify-end">
            <Button
              variant="flat"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              color="primary"
              isLoading={isPending}
              onClick={() => createAktivitas()}
            >
              Simpan Aktivitas
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
