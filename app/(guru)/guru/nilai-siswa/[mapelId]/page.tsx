"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardBody, Input, Button, Spinner, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import axios from "axios";

const JENIS_NILAI_OPTIONS = [
  { key: "TUGAS", label: "Tugas" },
  { key: "ULANGAN", label: "Ulangan" },
  { key: "UTS", label: "UTS" },
  { key: "UAS", label: "UAS" },
];

export default function InputNilaiPage() {
  const { mapelId } = useParams();
  const [nilaiMap, setNilaiMap] = useState<Record<string, number>>({});
  const [jenisNilai, setJenisNilai] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["nilai-input", mapelId],
    queryFn: async () => {
      const res = await axios.get(`/api/guru/nilai-siswa/${mapelId}`);
      return res.data.data;
    },
    enabled: !!mapelId,
  });

  if (isLoading) return <Spinner className="mt-10 mx-auto" />;
  if (error) return <p className="text-red-500">Gagal memuat data.</p>;

  const handleChange = (siswaId: string, value: string) => {
    setNilaiMap((prev) => ({
      ...prev,
      [siswaId]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = async () => {
    if (!jenisNilai) {
      alert("Pilih jenis nilai terlebih dahulu");
      return;
    }
    try {
      await axios.post(`/api/guru/nilai-siswa/${mapelId}`, {
        nilai: nilaiMap,
        jenis: jenisNilai,
        semester: "Ganjil", // ini bisa dibuat dropdown juga kalau perlu
      });
      alert("Nilai berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan nilai");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Input Nilai Siswa</h1>
      <p className="text-gray-600">
        Kelas <strong>{data.kelas}</strong> — Mapel{" "}
        <strong>{data.mataPelajaran}</strong>
      </p>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Daftar Siswa</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Pilih Jenis Nilai"
            placeholder="Pilih jenis nilai"
            selectedKeys={jenisNilai ? [jenisNilai] : []}
            onSelectionChange={(keys) => setJenisNilai(Array.from(keys)[0] as string)}
          >
            {JENIS_NILAI_OPTIONS.map((opt) => (
              <SelectItem key={opt.key} value={opt.key}>
                {opt.label}
              </SelectItem>
            ))}
          </Select>

          {data.siswa.map((siswa: any) => (
            <div key={siswa.id} className="flex items-center gap-4">
              <span className="w-64">{siswa.nama}</span>
              <Input
                type="number"
                placeholder="Nilai"
                value={nilaiMap[siswa.id] || ""}
                onChange={(e) => handleChange(siswa.id, e.target.value)}
              />
            </div>
          ))}

          <Button color="primary" onClick={handleSubmit}>
            Simpan Nilai
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
