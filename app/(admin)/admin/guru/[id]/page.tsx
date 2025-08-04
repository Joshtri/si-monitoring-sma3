"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { GuruWithUser } from "@/interfaces/guru";
import { getGuruById } from "@/services/guruService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function GuruViewPage() {
  const { id } = useParams(); // asumsikan route: /admin/guru/[id]/view

  const { data: guru, isLoading } = useQuery<GuruWithUser>({
    queryKey: ["guru", id],
    queryFn: () => getGuruById(id as string),
    enabled: !!id,
  });

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        title="Detail Guru"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Guru", href: "/admin/guru" },
          { label: "Detail Guru" },
        ]}
        backHref="/admin/guru"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <ReadOnlyInput label="Nama" value={guru?.nama} />
        <ReadOnlyInput label="NIP" value={guru?.nip} />
        <ReadOnlyInput label="Email" value={guru?.user?.email} />
        <ReadOnlyInput label="Username" value={guru?.user?.username} />
        <ReadOnlyInput label="Nomor HP" value={guru?.user?.phoneNumber} />
        <ReadOnlyInput label="User ID" value={guru?.user?.id} />
      </div>
    </div>
  );
}
