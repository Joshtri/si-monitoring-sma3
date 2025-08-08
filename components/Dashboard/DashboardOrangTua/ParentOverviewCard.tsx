"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getOrtuOverview } from "@/services/orangTuaDashboardService";
import {
  UsersIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline"; // Import icons

export default function ParentOverviewCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["parent-dashboard-overview"],
    queryFn: getOrtuOverview,
  });

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <div className="text-xl font-bold text-gray-900">Ringkasan</div>
          <div className="text-sm text-gray-500">Memuat statistik anak...</div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <div className="text-xl font-bold text-gray-900">Ringkasan</div>
          <div className="text-sm text-gray-500">
            Gagal memuat statistik anak.
          </div>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-40 text-red-500 font-medium">
          Gagal mengambil data.
        </CardBody>
      </Card>
    );
  }

  const { totalAnak, totalPelanggaran, rataRataNilai, absensiBulanIni } =
    data.data;

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold text-gray-900">Ringkasan</div>
          <div className="text-sm text-gray-500">Statistik bulan ini</div>
        </div>
      </CardHeader>
      <CardBody className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-start">
            <UsersIcon className="h-6 w-6 text-blue-500 mb-1" />
            <p className="text-sm text-gray-500">Total Anak</p>
            <p className="text-3xl font-bold text-gray-900">{totalAnak}</p>
          </div>
          <div className="flex flex-col items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mb-1" />
            <p className="text-sm text-gray-500">Pelanggaran</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalPelanggaran}
            </p>
          </div>
          <div className="flex flex-col items-start">
            <AcademicCapIcon className="h-6 w-6 text-green-500 mb-1" />
            <p className="text-sm text-gray-500">Nilai Rata-rata</p>
            <p className="text-3xl font-bold text-gray-900">
              {rataRataNilai ?? "-"}
            </p>
          </div>
          <div className="flex flex-col items-start">
            <CalendarDaysIcon className="h-6 w-6 text-purple-500 mb-1" />
            <p className="text-sm text-gray-500 mb-2">Absensi Bulan Ini</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {Object.entries(absensiBulanIni).map(([status, count]) => (
                <li key={status} className="flex justify-between w-full">
                  <span className="capitalize">{status.toLowerCase()}</span>:{" "}
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
