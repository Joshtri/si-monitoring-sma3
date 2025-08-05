// File: components/guru/JadwalHariIni.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";
import { Heading } from "@/components/ui/Heading";

interface JadwalItem {
  kelas: string;
  mataPelajaran: string;
  jamKe: number;
}

export default function JadwalHariIni() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<JadwalItem[]>({
    queryKey: ["guru-jadwal-hari-ini"],
    queryFn: async () => {
      const res = await fetch("/api/guru/me/jadwal-hari-ini");
      if (!res.ok) throw new Error("Gagal mengambil jadwal hari ini");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <Spinner label="Memuat jadwal hari ini..." />
        </CardBody>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert
        variant="flat"
        title="Gagal memuat jadwal"
        description="Silakan coba beberapa saat lagi."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading level={4}>Jadwal Hari Ini</Heading>
      </CardHeader>
      <CardBody>
        {data.length === 0 ? (
          <p className="text-sm text-default-600">
            Tidak ada jadwal mengajar hari ini.
          </p>
        ) : (
          <ul className="list-disc pl-5 text-sm text-default-700">
            {data.map((item, index) => (
              <li key={index}>
                Jam ke-{item.jamKe}: {item.mataPelajaran} - Kelas {item.kelas}
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
