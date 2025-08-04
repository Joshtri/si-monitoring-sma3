"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { OrangTuaWithUserAndAnak } from "@/interfaces/orang-tua";
import { getOrangTuaById } from "@/services/orangTuaService";

export default function OrangTuaViewPage() {
  const { id } = useParams();

  const { data: orangTua, isLoading } = useQuery<OrangTuaWithUserAndAnak>({
    queryKey: ["orangTua", id],
    queryFn: () => getOrangTuaById(id as string),
    enabled: !!id,
  });

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        title="Detail Orang Tua"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orang Tua", href: "/admin/orang-tua" },
          { label: "Detail Orang Tua" },
        ]}
        backHref="/admin/orang-tua"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <ReadOnlyInput label="Nama" value={orangTua?.nama} />
        <ReadOnlyInput label="Email" value={orangTua?.user?.email} />
        <ReadOnlyInput label="Username" value={orangTua?.user?.username} />
        <ReadOnlyInput label="Nomor HP" value={orangTua?.user?.phoneNumber} />
        <ReadOnlyInput label="User ID" value={orangTua?.user?.id} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">Daftar Anak</h3>
        {orangTua?.anak?.length ? (
          <ul className="list-disc list-inside text-sm space-y-1">
            {orangTua.anak.map((anak) => (
              <li key={anak.id}>
                {anak.namaDepan} {anak.namaTengah ?? ""} {anak.namaBelakang ?? ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">Belum ada anak terdaftar.</p>
        )}
      </div>
    </div>
  );
}
