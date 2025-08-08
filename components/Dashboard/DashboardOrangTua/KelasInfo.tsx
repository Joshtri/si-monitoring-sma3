"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getKelasInfo } from "@/services/orangTuaDashboardService";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline"; // Import BuildingLibraryIcon

interface KelasInfoProps {
  siswaId: string;
}

export default function KelasInfo({ siswaId }: KelasInfoProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["kelas-info", siswaId],
    queryFn: () => getKelasInfo(siswaId),
    enabled: !!siswaId,
  });

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <BuildingLibraryIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="flex flex-col"> {/* Removed gap-2 and ml-auto from here */}
            <div className="text-xl font-bold text-gray-900">Info Kelas</div>
            <div className="text-sm text-gray-500">
              Menampilkan informasi kelas anak Anda.
            </div>
          </div>
        </CardHeader>
        <CardBody className="flex justify-center items-center h-40">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
          <BuildingLibraryIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div className="flex flex-col"> {/* Removed gap-2 and ml-auto from here */}
            <div className="text-xl font-bold text-gray-900">Info Kelas</div>
            <div className="text-sm text-gray-500">
              Menampilkan informasi kelas anak Anda.
            </div>
          </div>
        </CardHeader>
        <CardBody className="flex justify-center items-center h-40 text-red-500 font-medium">
          Gagal memuat informasi kelas.
        </CardBody>
      </Card>
    );
  }

  // Memastikan data.data adalah array dan mengambil elemen pertama
  const kelasInfo = data.data && data.data.length > 0 ? data.data[0] : {};
  const { kelas, tahunAjaran, waliKelas } = kelasInfo;

  return (
    <Card className="w-full rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center">
        <BuildingLibraryIcon className="h-6 w-6 text-gray-600 mr-2" />
        <div className="flex flex-col"> {/* Removed gap-2 and ml-auto from here */}
          <div className="text-xl font-bold text-gray-900">Info Kelas</div>
          <div className="text-sm text-gray-500">
            Menampilkan informasi kelas anak Anda.
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-3 p-6 text-gray-700">
        <div>
          <strong className="font-semibold text-gray-900">Kelas:</strong>{" "}
          {kelas || "-"}
        </div>
        <div>
          <strong className="font-semibold text-gray-900">Tahun Ajaran:</strong>{" "}
          {tahunAjaran || "-"}
        </div>
        <div>
          <strong className="font-semibold text-gray-900">Wali Kelas:</strong>{" "}
          {waliKelas?.nama || "-"}
        </div>
      </CardBody>
    </Card>
  );
}
