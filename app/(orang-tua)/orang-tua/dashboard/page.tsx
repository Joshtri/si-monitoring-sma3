"use client";

import React, { useEffect, useState } from "react";
import { Divider, Spinner } from "@heroui/react";
import ParentOverviewCard from "@/components/Dashboard/DashboardOrangTua/ParentOverviewCard";
import PerAnakSummary from "@/components/Dashboard/DashboardOrangTua/PerAnakSummary";
import AttendanceSummary from "@/components/Dashboard/DashboardOrangTua/AttendanceSummary";
import AttendanceSummaryChart from "@/components/Dashboard/DashboardOrangTua/AttendanceSummaryChart";
import GradesOverviewChart from "@/components/Dashboard/DashboardOrangTua/GradesOverviewChart";
import ViolationsSummaryChart from "@/components/Dashboard/DashboardOrangTua/ViolationsSummaryChart";
import ActivitiesSummary from "@/components/Dashboard/DashboardOrangTua/ActivitiesSummary";
import AttendanceHistory from "@/components/Dashboard/DashboardOrangTua/AttendanceHistory";
import GradesHistory from "@/components/Dashboard/DashboardOrangTua/GradesHistory";
import ViolationsHistory from "@/components/Dashboard/DashboardOrangTua/ViolationsHistory";
import KelasInfo from "@/components/Dashboard/DashboardOrangTua/KelasInfo";
// import TopPerformersTable from "@/components/Dashboard/DashboardOrangTua/TopPerformersTable";
import { getAnakOverview } from "@/services/orangTuaDashboardService";
import { HomeIcon } from "@heroicons/react/24/outline";
import TopPerformersTable from "@/components/Dashboard/DashboardOrangTua/TopPerformersTable";

export default function DashboardOrangTuaPage() {
  const [siswaId, setSiswaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnak = async () => {
      try {
        const res = await getAnakOverview();
        if (res.success && res.data.length > 0) {
          setSiswaId(res.data[0].id); // Ambil siswa pertama
        }
      } catch (e) {
        console.error("Gagal ambil siswa:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnak();
  }, []);

  if (loading || !siswaId) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-xl shadow-sm">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
        <HomeIcon className="h-8 w-8 text-gray-700 mr-3" />
        Dashboard Orang Tua
      </h1>
      <div className="space-y-8">
        <ParentOverviewCard />
        <PerAnakSummary />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AttendanceSummary />
          <AttendanceSummaryChart />
          <GradesOverviewChart />
          <ViolationsSummaryChart />
        </div>
        <ActivitiesSummary />
        <Divider className="my-8 border-gray-200" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AttendanceHistory siswaId={siswaId} />
          <GradesHistory siswaId={siswaId} />
          <ViolationsHistory siswaId={siswaId} />
          <KelasInfo siswaId={siswaId} />
        </div>
        <Divider className="my-8 border-gray-200" />
        <TopPerformersTable />
      </div>
    </div>
  );
}
