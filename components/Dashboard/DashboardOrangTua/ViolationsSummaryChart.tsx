"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getViolationsSummary } from "@/services/orangTuaDashboardService";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { ChartPieIcon } from "@heroicons/react/24/outline"; // Import ChartPieIcon

const COLORS = [
  "#f87171", // red-400
  "#fb923c", // orange-400
  "#facc15", // yellow-400
  "#34d399", // emerald-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
];

export default function ViolationsSummaryChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["parent-violations-summary"],
    queryFn: getViolationsSummary,
  });

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <ChartPieIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">
            Ringkasan Pelanggaran
          </div>
          <div className="text-sm text-gray-500 ml-auto">
            Total poin dan jenis pelanggaran terbanyak
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <ChartPieIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="text-xl font-bold text-gray-900">
            Ringkasan Pelanggaran
          </div>
          <div className="text-sm text-gray-500 ml-auto">
            Total poin dan jenis pelanggaran terbanyak
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-64 text-red-500 font-medium">
          Gagal memuat data pelanggaran.
        </CardBody>
      </Card>
    );
  }

  const {
    totalPelanggaran = 0,
    totalPoin = 0,
    jenisPelanggaran = [],
  } = data.data ?? {};

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <ChartPieIcon className="h-6 w-6 text-gray-600 mr-2" />
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold text-gray-900">
            Ringkasan Pelanggaran
          </div>
          <div className="text-sm text-gray-500 ml-auto">
            Total pelanggaran:{" "}
            <strong className="text-gray-900">{totalPelanggaran}</strong>, total
            poin: <strong className="text-gray-900">{totalPoin}</strong>
          </div>
        </div>
      </CardHeader>
      <CardBody className="h-64 p-4">
        {jenisPelanggaran.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="count"
                data={jenisPelanggaran}
                nameKey="jenis"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {jenisPelanggaran.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-lg text-gray-400">
            Tidak ada pelanggaran tercatat.
          </div>
        )}
      </CardBody>
    </Card>
  );
}
