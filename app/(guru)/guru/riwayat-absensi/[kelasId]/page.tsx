// app/(guru)/riwayat-absensi/[kelasId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDetailRiwayatAbsensi } from "@/services/guruService";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";

export default function DetailRiwayatAbsensiPage() {
  const params = useParams();
  const kelasId = params?.kelasId as string;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!kelasId) return;

    getDetailRiwayatAbsensi(kelasId)
      .then((res) => {
        const transformed = Object.entries(res).map(([tanggal, siswa]) => ({
          tanggal,
          siswa,
        }));
        setData(transformed);
      })
      .finally(() => setLoading(false));
  }, [kelasId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HADIR":
        return "success";
      case "SAKIT":
        return "warning";
      case "IZIN":
        return "primary";
      case "ALPHA":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Detail Riwayat Absensi</h1>

      {loading ? (
        <Spinner label="Memuat data..." />
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada data absensi</p>
      ) : (
        data.map((riwayat) => (
          <Card key={riwayat.tanggal}>
            <CardHeader>
              <h2 className="text-sm font-semibold">
                Tanggal: {new Date(riwayat.tanggal).toLocaleDateString("id-ID")}
              </h2>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nama</th>
                    <th className="border p-2">NIS</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.siswa.map((siswa: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border p-2 text-center">{idx + 1}</td>
                      <td className="border p-2">{siswa.nama}</td>
                      <td className="border p-2">{siswa.nis}</td>
                      <td className="border p-2 text-center">
                        <Chip
                          size="sm"
                          color={getStatusColor(siswa.status)}
                          variant="flat"
                        >
                          {siswa.status}
                        </Chip>
                      </td>
                      <td className="border p-2">{siswa.keterangan || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
}
