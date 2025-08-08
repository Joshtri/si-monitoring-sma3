"use client";

import { Card, CardHeader, CardBody, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getAttendanceSummary } from "@/services/orangTuaDashboardService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartPieIcon } from "@heroicons/react/24/outline";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171"];
const STATUS_LABELS = {
  HADIR: "Hadir",
  SAKIT: "Sakit",
  IZIN: "Izin",
  ALPHA: "Alpha",
};

export default function AttendanceSummaryChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["parent-attendance-summary"],
    queryFn: getAttendanceSummary,
  });

  const renderCard = (content: React.ReactNode) => (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <ChartPieIcon className="h-6 w-6 text-gray-600 mr-2" />
        <div className="text-xl font-bold text-gray-900">Ringkasan Absensi</div>
        <div className="text-sm text-gray-500 ml-auto">Bulan ini</div>
      </CardHeader>
      <CardBody className="h-64 p-4 flex items-center justify-center">
        {content}
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return renderCard(<Spinner size="lg" />);
  }

  if (isError || !data?.success) {
    return renderCard(
      <div className="text-red-500 font-medium">Gagal memuat data absensi.</div>
    );
  }

  const attendanceSummary = data.data;

  // Gabungkan absensi semua anak
  const totalAbsensi = attendanceSummary.reduce(
    (acc: Record<string, number>, anak: any) => {
      const absensi = anak.absensi || {};
      for (const status in absensi) {
        acc[status] = (acc[status] || 0) + absensi[status];
      }
      return acc;
    },
    {}
  );

  const chartData = Object.entries(totalAbsensi)
    .map(([key, value]) => ({
      name: STATUS_LABELS[key as keyof typeof STATUS_LABELS] || key,
      value,
    }))
    .filter((entry) => entry.value > 0); // 👈 hanya tampilkan yang ada datanya

  if (chartData.length === 0) {
    return renderCard(
      <div className="text-gray-500 font-medium">
        Tidak ada data absensi untuk bulan ini.
      </div>
    );
  }

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <ChartPieIcon className="h-6 w-6 text-gray-600 mr-2" />
        <div className="text-xl font-bold text-gray-900">Ringkasan Absensi</div>
        <div className="text-sm text-gray-500 ml-auto">Bulan ini</div>
      </CardHeader>
      <CardBody className="h-64 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
