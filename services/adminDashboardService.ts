import api from "@/lib/axios"

export async function getGradesOverview(semester?: string) {
    const params = semester ? { semester } : {}
    const response = await api.get("/api/admin/me/academic/grades-overview", { params })
    return response.data
}


export async function getTopPerformers(limit: number = 5, semester?: string) {
    const params = {
        limit,
        ...(semester ? { semester } : {}),
    }

    const response = await api.get("/api/admin/me/academic/top-performers", { params })
    return response.data
}

export async function getActivitiesParticipation() {
    const response = await api.get("/api/admin/me/activities/participation")
    return response.data
}

export async function getAttendanceSummary(startDate: string, endDate: string) {
    const response = await api.get("/api/admin/me/attendance/summary", {
        params: { startDate, endDate },
    })
    return response.data
}


export async function getDailyAttendanceTrend(days: number = 7) {
    const response = await api.get("/api/admin/me/attendance/daily-trend", {
        params: { days },
    })
    return response.data
}

export async function getProblematicStudents(limit: number = 5) {
  const response = await api.get("/api/admin/me/attendance/problematic-students", {
    params: { limit },
  })
  return response.data
}

export async function getViolationsSummary(startDate: string, endDate: string) {
  const response = await api.get("/api/admin/me/discipline/violations-summary", {
    params: { startDate, endDate },
  })
  return response.data
}



//stats overview
export async function getOverviewStats() {
  const response = await api.get("/api/admin/me/stats/overview")
  return response.data
}

export async function getStudentsPerClass() {
  const response = await api.get("/api/admin/me/stats/students-per-class")
  return response.data
}