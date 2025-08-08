// services/orangTuaDashboardService.ts

import api from "@/lib/axios"

export const getOrtuOverview = async () => {
  const res = await api.get("/api/orang-tua/dashboard/overview")
  return res.data
}

export const getAttendanceSummary = async () => {
  const res = await api.get("/api/orang-tua/dashboard/attendance/summary")
  return res.data
}

export const getGradesOverview = async (semester?: string) => {
  const res = await api.get("/api/orang-tua/dashboard/grades/overview", {
    params: { semester },
  })
  return res.data
}

export const getViolationsSummary = async () => {
  const res = await api.get("/api/orang-tua/dashboard/violations/summary")
  return res.data
}

export const getActivitiesSummary = async () => {
  const res = await api.get("/api/orang-tua/dashboard/activities/summary")
  return res.data
}

export const getAnakOverview = async () => {
  const res = await api.get("/api/orang-tua/dashboard/per-anak")
  return res.data
}

export const getAttendanceHistory = async (siswaId: string) => {
  const res = await api.get(`/api/orang-tua/dashboard/attendance/history`, {
    params: { siswaId },
  })
  return res.data
}

export const getGradesHistory = async (siswaId: string, semester?: string) => {
  const res = await api.get(`/api/orang-tua/dashboard/grades/history`, {
    params: { siswaId, semester },
  })
  return res.data
}

export const getViolationsHistory = async (siswaId: string) => {
  const res = await api.get(`/api/orang-tua/dashboard/violations/history`, {
    params: { siswaId },
  })
  return res.data
}

export const getKelasInfo = async (siswaId: string) => {
  const res = await api.get(`/api/orang-tua/dashboard/kelas`, {
    params: { siswaId },
  })
  return res.data
}

export const getTopPerformers = async (semester?: string) => {
  const res = await api.get(`/api/orang-tua/dashboard/top-performers`, {
    params: { semester },
  })
  return res.data
}





export const getKelasInfoList = async () => {
  const res = await api.get("/api/orang-tua/kelas");
  return res.data;
};