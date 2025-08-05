"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getKelasHariIni,
  getSiswaByKelasHariIni,
  submitAbsensi,
} from "@/services/guruService";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { showToast } from "@/utils/toastHelper";

const statusOptions = [
  { key: "HADIR", label: "Hadir", color: "success" },
  { key: "SAKIT", label: "Sakit", color: "warning" },
  { key: "IZIN", label: "Izin", color: "primary" },
  { key: "ALPHA", label: "Alpha", color: "danger" },
];

interface SiswaAbsensi {
  siswaKelasId: string;
  siswaId: string;
  nama: string;
  nis: string;
  nisn: string;
  status: "HADIR" | "SAKIT" | "IZIN" | "ALPHA";
  keterangan?: string | null;
  sudahAbsen: boolean;
  absenId?: string | null;
}

interface AbsensiResponse {
  siswa: SiswaAbsensi[];
  kelasInfo: {
    kelas: string;
    jadwal: {
      hari: string;
      jamKe: number;
      mataPelajaran: string;
    };
  };
  tanggal: string;
}

export default function AbsensiPerKelasPage() {
  const [kelasId, setKelasId] = useState<string | null>(null);
  const [absenData, setAbsenData] = useState<SiswaAbsensi[]>([]);
  const [keteranganData, setKeteranganData] = useState<{
    [key: string]: string;
  }>({});

  const queryClient = useQueryClient();

  const { data: kelasOptions, isLoading: isLoadingKelas } = useQuery({
    queryKey: ["kelas-hari-ini"],
    queryFn: getKelasHariIni,
  });

  const {
    data: absensiResponse,
    isLoading: isLoadingSiswa,
    error: errorSiswa,
    refetch,
  } = useQuery<AbsensiResponse>({
    queryKey: ["siswa-per-kelas", kelasId],
    queryFn: () => getSiswaByKelasHariIni(kelasId!),
    enabled: !!kelasId,
  });

  useEffect(() => {
    if (absensiResponse?.siswa) {
      setAbsenData(absensiResponse.siswa);

      // Initialize keterangan data
      const initialKeterangan: { [key: string]: string } = {};
      absensiResponse.siswa.forEach((siswa) => {
        if (siswa.keterangan) {
          initialKeterangan[siswa.siswaKelasId] = siswa.keterangan;
        }
      });
      setKeteranganData(initialKeterangan);
    }
  }, [absensiResponse]);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: submitAbsensi,
    onSuccess: (response) => {
      showToast({
        title: "Absensi berhasil disimpan",
        description: response.message || "Data absensi telah tercatat",
        color: "success",
      });

      // Refresh data
      refetch();
      queryClient.invalidateQueries({ queryKey: ["siswa-per-kelas", kelasId] });
    },
    onError: (error: any) => {
      showToast({
        title: "Gagal menyimpan absensi",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data",
        color: "error",
      });
    },
  });

  const handleStatusChange = (index: number, status: string) => {
    const updated = [...absenData];
    updated[index].status = status as "HADIR" | "SAKIT" | "IZIN" | "ALPHA";
    setAbsenData(updated);
  };

  const handleKeteranganChange = (siswaKelasId: string, keterangan: string) => {
    setKeteranganData((prev) => ({
      ...prev,
      [siswaKelasId]: keterangan,
    }));
  };

  const handleSubmit = () => {
    // Combine absen data with keterangan
    const finalData = absenData.map((siswa) => ({
      ...siswa,
      keterangan: keteranganData[siswa.siswaKelasId] || null,
    }));

    mutate(finalData); 
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.key === status);
    return option?.color || "default";
  };

  const getSummary = () => {
    const summary = {
      hadir: 0,
      sakit: 0,
      izin: 0,
      alpha: 0,
    };

    absenData.forEach((siswa) => {
      if (siswa.status === "HADIR") summary.hadir++;
      else if (siswa.status === "SAKIT") summary.sakit++;
      else if (siswa.status === "IZIN") summary.izin++;
      else if (siswa.status === "ALPHA") summary.alpha++;
    });

    return summary;
  };

  if (errorSiswa && kelasId) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Absensi Per Kelas</h1>
        <Card className="bg-red-50 border-red-200">
          <CardBody>
            <p className="text-red-600">
              {errorSiswa.response?.data?.message ||
                "Terjadi kesalahan saat memuat data"}
            </p>
            <Button
              color="primary"
              variant="ghost"
              onPress={() => refetch()}
              className="mt-2"
            >
              Coba Lagi
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Absensi Per Kelas</h1>

      <div className="max-w-md">
        {isLoadingKelas ? (
          <Spinner label="Memuat daftar kelas..." />
        ) : (
          <Autocomplete
            aria-label="Pilih Kelas"
            label="Pilih Kelas"
            placeholder="Contoh: X IPA 1"
            selectedKey={kelasId ?? undefined}
            onSelectionChange={(val) => setKelasId(val as string)}
            className="max-w-md"
          >
            {kelasOptions?.map((kelas: any) => (
              <AutocompleteItem key={kelas.id}>
                {kelas.kelas} - (Jam ke-{kelas.jamKe}) - {kelas.mapel}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        )}
      </div>

      {isLoadingSiswa && kelasId && <Spinner label="Memuat daftar siswa..." />}

      {absensiResponse && absenData.length > 0 && (
        <>
          {/* Info Kelas dan Jadwal */}
          <Card>
            <CardBody>
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <h3 className="font-semibold text-lg">
                    {absensiResponse.kelasInfo.kelas}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {absensiResponse.kelasInfo.jadwal.mataPelajaran} - Jam ke-
                    {absensiResponse.kelasInfo.jadwal.jamKe} -
                    {absensiResponse.kelasInfo.jadwal.hari}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tanggal:{" "}
                    {new Date(absensiResponse.tanggal).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>

                {/* Summary */}
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(getSummary()).map(([status, count]) => (
                    <Chip
                      key={status}
                      color={getStatusColor(status.toUpperCase())}
                      variant="flat"
                      size="sm"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
                      {count}
                    </Chip>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tabel Absensi */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <span>Daftar Siswa ({absenData.length} orang)</span>
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  onPress={handleSubmit}
                  size="sm"
                >
                  Simpan Absensi
                </Button>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">NIS</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Keterangan</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {absenData.map((siswa, index) => (
                    <tr key={siswa.siswaKelasId} className="border-b">
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">
                        <div>
                          {siswa.nama}
                          {siswa.sudahAbsen && (
                            <Chip
                              size="sm"
                              color="success"
                              variant="flat"
                              className="ml-2"
                            >
                              Sudah Diabsen
                            </Chip>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border">{siswa.nis}</td>
                      <td className="p-2 border">
                        <Autocomplete
                          aria-label="Status Absensi"
                          className="max-w-xs"
                          defaultItems={statusOptions}
                          selectedKey={siswa.status}
                          onSelectionChange={(value) =>
                            handleStatusChange(index, value as string)
                          }
                        >
                          {(item) => (
                            <AutocompleteItem key={item.key}>
                              {item.label}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>
                      </td>
                      <td className="p-2 border">
                        <Input
                          size="sm"
                          placeholder="Keterangan (opsional)"
                          value={keteranganData[siswa.siswaKelasId] || ""}
                          onValueChange={(value) =>
                            handleKeteranganChange(siswa.siswaKelasId, value)
                          }
                          className="max-w-xs"
                        />
                      </td>
                      <td className="p-2 border">
                        <Chip
                          color={getStatusColor(siswa.status)}
                          size="sm"
                          variant="flat"
                        >
                          {
                            statusOptions.find(
                              (opt) => opt.key === siswa.status
                            )?.label
                          }
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
