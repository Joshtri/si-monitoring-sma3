import { PageHeader } from "@/components/common/PageHeader";
import ProfileGrid from "@/components/ProfileGrid/ProfileGrid";
import React from "react";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your profile settings and information."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Profile" },
        ]}
      />

      <ProfileGrid/>
    </>
  );
}
