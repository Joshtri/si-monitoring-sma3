// File: components/guru/ChartAbsensiGuru.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";
import { Heading } from "@/components/ui/Heading";

interface AbsenDayStat {
  label: string;
  total: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
}

export default function ChartAbsensiGuru() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<AbsenDayStat[]>({
    queryKey: ["guru-rekap-absen"],
    queryFn: async () => {
      const res = await fetch("/api/guru/me/rekap-absen-7-hari");
      if (!res.ok) throw new Error("Gagal mengambil data rekap absen");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <Spinner label="Memuat grafik absensi..." />
        </CardBody>
      </Card>   
    );
  }

  if (isError) {
    return (
      <Alert
        variant="flat"
        title="Gagal memuat grafik"
        description="Silakan coba beberapa saat lagi."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading level={4}>Grafik Kehadiran 7 Hari Terakhir</Heading>
      </CardHeader>
      <CardBody className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, bottom: 30 }}>
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="hadir" name="Hadir" fill="#4ade80" />
            <Bar dataKey="izin" name="Izin" fill="#facc15" />
            <Bar dataKey="sakit" name="Sakit" fill="#60a5fa" />
            <Bar dataKey="alpha" name="Alpha" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
