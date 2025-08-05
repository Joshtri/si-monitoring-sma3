// app/(guru)/riwayat-absensi/page.tsx
"use client";

import {
  getKelasYangDiajar
} from "@/services/guruService";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RiwayatAbsensiGuruPage() {
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [expandedKelasId, setExpandedKelasId] = useState<string | null>(null);
  const [riwayat, setRiwayat] = useState<Record<string, any[]>>({});
  const [loadingRiwayat, setLoadingRiwayat] = useState<string | null>(null);

  useEffect(() => {
    getKelasYangDiajar().then(setKelasList);
  }, []);

  const router = useRouter();


  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Riwayat Absensi</h1>

      {kelasList.length === 0 ? (
        <p>Belum ada kelas yang diajar</p>
      ) : (
        kelasList.map((kelas) => (
          <Card key={`${kelas.id}-${kelas.mataPelajaran}`}>
            <CardHeader className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{kelas.kelas}</h3>
                <p className="text-sm text-gray-500">{kelas.mataPelajaran}</p>
              </div>
              <Button
                size="sm"
                onPress={() => router.push(`/guru/riwayat-absensi/${kelas.id}`)}
                color="primary"
              >
                Lihat Riwayat Absensi
              </Button>
            </CardHeader>
            {expandedKelasId === kelas.id && (
              <CardBody>
                {loadingRiwayat === kelas.id ? (
                  <Spinner label="Memuat riwayat..." />
                ) : riwayat[kelas.id]?.length ? (
                  <ul className="text-sm list-disc pl-4 space-y-1">
                    {riwayat[kelas.id].map((r) => (
                      <li key={r.tanggal}>
                        {new Date(r.tanggal).toLocaleDateString("id-ID")} -{" "}
                        {r.jumlah} siswa
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    Belum ada riwayat absensi
                  </p>
                )}
              </CardBody>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
