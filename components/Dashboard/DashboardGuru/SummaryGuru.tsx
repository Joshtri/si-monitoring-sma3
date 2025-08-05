// File: components/guru/SummaryGuru.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export default function SummaryGuru() {
  const { data, isLoading, isError } = useQuery<{
    totalMapel: number;
    totalKelas: number;
  }>({
    queryKey: ["guru-summary"],
    queryFn: async () => {
      const res = await fetch("/api/guru/me/summary");
      if (!res.ok) throw new Error("Gagal mengambil data summary guru");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <Spinner label="Memuat ringkasan data..." />
        </CardBody>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        variant="flat"
        title="Gagal memuat ringkasan"
        description="Silakan coba beberapa saat lagi."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading level={4}>Ringkasan Data Guru</Heading>
      </CardHeader>
      <CardBody>
        <ul className="space-y-2 text-sm text-default-700">
          <li>
            <Text>Total Mata Pelajaran Diampu:</Text>{" "}
            <strong>{data.totalMapel}</strong>
          </li>
          <li>
            <Text>Total Kelas Diampu:</Text> <strong>{data.totalKelas}</strong>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
}
