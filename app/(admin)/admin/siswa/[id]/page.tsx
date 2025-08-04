"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { getSiswaById } from "@/services/siswaService";

export default function SiswaDetailPage() {
  const { id } = useParams() as { id: string };

  const { data: siswa, isLoading } = useQuery({
    queryKey: ["siswa", id],
    queryFn: () => getSiswaById(id),
    enabled: !!id,
  });

  if (isLoading || !siswa) {
    return <div className="p-4">Memuat data siswa...</div>;
  }

  const namaLengkap = [siswa.namaDepan, siswa.namaTengah, siswa.namaBelakang]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="p-4 space-y-4 md:space-y-6">
      <PageHeader
        title="Detail Siswa"
        description="Lihat informasi lengkap tentang siswa."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Siswa", href: "/admin/siswa" },
          { label: "Detail Siswa" },
        ]}
        backHref="/admin/siswa"
      />

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyInput label="Nama Lengkap" value={namaLengkap} />
          <ReadOnlyInput label="Jenis Kelamin" value={siswa.jenisKelamin.replace("_", " ")} />
          <ReadOnlyInput label="NIS" value={siswa.nis ?? "-"} />
          <ReadOnlyInput label="NISN" value={siswa.nisn ?? "-"} />
          <ReadOnlyInput label="Alamat" value={siswa.alamat ?? "-"} />
          <ReadOnlyInput label="Orang Tua" value={siswa.orangTua?.nama ?? "-"} />
        </div>
      </div>
    </div>
  );
}
