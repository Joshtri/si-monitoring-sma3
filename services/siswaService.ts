// import { api } from "@/lib/axios"; // pastikan ada file api.ts sebagai axios instance

import api from "@/lib/axios";

export async function getAllSiswa() {
  const res = await api.get("/api/siswa");
  return res.data;
}

export async function getSiswaById(id: string) {
  const res = await api.get(`/api/siswa/${id}`);
  return res.data;
}

export async function createSiswa(data: any) {
  const res = await api.post("/api/siswa", data);
  return res.data;
}

export async function updateSiswa(id: string, data: any) {
  const res = await api.patch(`/api/siswa/${id}`, data);
  return res.data;
}

export async function deleteSiswa(id: string) {
  const res = await api.delete(`/api/siswa/${id}`);
  return res.data;
}
