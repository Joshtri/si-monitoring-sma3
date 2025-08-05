// File: app/guru/dashboard/page.tsx

"use client";

import ChartAbsensiGuru from "@/components/Dashboard/DashboardGuru/ChartAbsensiGuru";
import JadwalHariIni from "@/components/Dashboard/DashboardGuru/JadwalHariIni";
import StatistikAbsensiHariIni from "@/components/Dashboard/DashboardGuru/StatistikAbsensiHariIni";
import SummaryGuru from "@/components/Dashboard/DashboardGuru/SummaryGuru";


export default function DashboardGuruPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryGuru />
        <StatistikAbsensiHariIni />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JadwalHariIni />
        <ChartAbsensiGuru/>
        {/* <RekapAbsensiChart /> */}
      </div>
    </div>
  );
}
