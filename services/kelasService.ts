// services/kelasService.ts

import api from "@/lib/axios";

// Ambil semua kelas dari tahun ajaran aktif
export async function getAllKelas() {
    const res = await api.get("/api/kelas");
    return res.data;
}

// Tambah kelas baru
export async function createKelas(data: {
    kelas: string;
    tahunAjaranId: string;
    waliKelasId?: string | null;
}) {
const res = await api.post("/api/kelas", data);
    return res.data;
}

// Ambil detail kelas by ID (jika kamu butuh untuk edit nanti)
export async function getKelasById(id: string) {
    const res = await api.get(`/api/kelas/${id}`);
    return res.data;
}

// Update kelas
export async function patchKelas(id: string, data: {
    kelas?: string;
    tahunAjaranId?: string;
    waliKelasId?: string | null;
}) {
    const res = await api.patch(`/api/kelas/${id}`, data);
    return res.data;
}

// Hapus kelas
export async function deleteKelas(id: string) {
    const res = await api.delete(`/api/kelas/${id}`);
    return res.data;
}

// Ambil semua siswa dari kelas tertentu
export async function getSiswaByKelasId(kelasId: string) {
  const res = await api.get(`/api/kelas/${kelasId}/siswa`);
  return res.data;
}



export async function getSiswaBelumPunyaKelas() {
  const res = await api.get("/api/siswa/belum-punya-kelas");
  return res.data;
}

export async function assignSiswaToKelas(kelasId: string, siswaIds: string[]) {
  const res = await api.post(`/api/kelas/${kelasId}/assign-siswa`, { siswaIds });
  return res.data;
}