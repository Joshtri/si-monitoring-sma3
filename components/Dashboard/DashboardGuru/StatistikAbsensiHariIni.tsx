// File: components/guru/StatistikAbsensiHariIni.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";
import { Heading } from "@/components/ui/Heading";

export default function StatistikAbsensiHariIni() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["guru-statistik-absensi-hari-ini"],
    queryFn: async () => {
      const res = await fetch("/api/guru/me/statistik-absensi-hari-ini");
      if (!res.ok) throw new Error("Gagal mengambil data absensi hari ini");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <Spinner label="Memuat statistik absensi..." />
        </CardBody>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        variant="flat"
        title="Gagal memuat statistik absensi"
        description="Silakan coba beberapa saat lagi."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading level={4}>Statistik Absensi Hari Ini</Heading>
      </CardHeader>
      <CardBody>
        <ul className="grid grid-cols-2 gap-y-1 text-sm text-default-700">
          <li>
            Total: <strong>{data.total}</strong>
          </li>
          <li>
            Hadir: <strong>{data.hadir}</strong>
          </li>
          <li>
            Izin: <strong>{data.izin}</strong>
          </li>
          <li>
            Sakit: <strong>{data.sakit}</strong>
          </li>
          <li>
            Alpha: <strong>{data.alpha}</strong>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
}
