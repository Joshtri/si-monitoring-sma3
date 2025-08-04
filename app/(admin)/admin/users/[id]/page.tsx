"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { getUserById } from "@/services/usersService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function UsersViewPage() {
  const { id } = useParams(); // asumsikan dynamic route /admin/users/[id]/view

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        title="Detail Pengguna"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Pengguna", href: "/admin/users" },
          { label: "Detail Pengguna" },
        ]}
        backHref="/admin/users"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <ReadOnlyInput label="Username" value={user?.username} />
        <ReadOnlyInput label="Email" value={user?.email} />
        <ReadOnlyInput label="Nomor HP" value={user?.phoneNumber} />
        <ReadOnlyInput
          label="Role"
          value={user?.role?.toLowerCase().replace("_", " ")}
        />
        <ReadOnlyInput label="User ID" value={user?.id} />
      </div>
    </div>
  );
}
