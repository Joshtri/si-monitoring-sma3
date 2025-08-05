// File: components/guru/RekapAbsensiChart.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";
import { Heading } from "@/components/ui/Heading";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AbsensiStatItem {
  tanggal: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
}

export default function RekapAbsensiChart() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<AbsensiStatItem[]>({
    queryKey: ["guru-absensi-7-hari"],
    queryFn: async () => {
      const res = await fetch("/api/guru/me/absensi-7-hari");
      if (!res.ok) throw new Error("Gagal mengambil data rekap absensi");
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
        <Heading level={4}>Rekap Absensi 7 Hari Terakhir</Heading>
      </CardHeader>
      <CardBody>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <XAxis dataKey="tanggal" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hadir" stackId="a" fill="#16a34a" name="Hadir" />
              <Bar dataKey="sakit" stackId="a" fill="#facc15" name="Sakit" />
              <Bar dataKey="izin" stackId="a" fill="#3b82f6" name="Izin" />
              <Bar dataKey="alpha" stackId="a" fill="#ef4444" name="Alpha" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
