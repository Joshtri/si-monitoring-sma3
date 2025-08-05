"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Spinner } from "@heroui/react"

// Dynamic imports untuk seluruh komponen dashboard
const OverviewCards = dynamic(() => import("@/components/Dashboard/DashboardAdmin/OverviewCards"), { ssr: false })
const StudentsPerClassChart = dynamic(() => import("@/components/Dashboard/DashboardAdmin/StudentsPerClassChart"), { ssr: false })
const AttendanceSummaryCard = dynamic(() => import("@/components/Dashboard/DashboardAdmin/AttendanceSummaryCard"), { ssr: false })
const DailyAttendanceTrendChart = dynamic(() => import("@/components/Dashboard/DashboardAdmin/DailyAttendanceTrendChart"), { ssr: false })
const ProblematicStudentsTable = dynamic(() => import("@/components/Dashboard/DashboardAdmin/ProblematicStudentsTable"), { ssr: false })
const ViolationsSummaryCard = dynamic(() => import("@/components/Dashboard/DashboardAdmin/ViolationsSummaryCard"), { ssr: false })
const TopPerformersTable = dynamic(() => import("@/components/Dashboard/DashboardAdmin/TopPerformersTable"), { ssr: false })
const GradesOverviewCard = dynamic(() => import("@/components/Dashboard/DashboardAdmin/GradesOverviewCard"), { ssr: false })
const ActivitiesParticipationOverview = dynamic(() => import("@/components/Dashboard/DashboardAdmin/ActivitiesParticipationOverview"), { ssr: false })

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
        <OverviewCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
          <StudentsPerClassChart />
        </Suspense>
        <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
          <AttendanceSummaryCard />
        </Suspense>
      </div>

      <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
        <DailyAttendanceTrendChart />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
          <ProblematicStudentsTable />
        </Suspense>
        <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
          <ViolationsSummaryCard />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
          <TopPerformersTable />
        </Suspense>
        <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
          <GradesOverviewCard />
        </Suspense>
      </div>

      <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
        <ActivitiesParticipationOverview />
      </Suspense>
    </div>
  )
}
