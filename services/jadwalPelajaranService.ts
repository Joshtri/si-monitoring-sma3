import api from "@/lib/axios";

export interface JadwalPelajaranPayload {
    kelasTahunAjaranId: string;
    hari: string;
    jamKe: number;
    guruMapelId: string;
}

// Ambil semua jadwal
export async function getAllJadwal() {
    const res = await api.get("/api/jadwal");
    return res.data;
}

// Tambah jadwal baru
export async function createJadwal(data: JadwalPelajaranPayload) {
    const res = await api.post("/api/jadwal", data);
    return res.data;
}

// Ambil detail jadwal berdasarkan ID
export async function getJadwalById(id: string) {
    const res = await api.get(`/api/jadwal/${id}`);
    return res.data;
}

// Update jadwal
export async function patchJadwal(id: string, data: Partial<JadwalPelajaranPayload>) {
    const res = await api.patch(`/api/jadwal/${id}`, data);
    return res.data;
}

// Hapus jadwal
export async function deleteJadwal(id: string) {
    const res = await api.delete(`/api/jadwal/${id}`);
    return res.data;
}

// (Opsional) Ambil semua jadwal berdasarkan kelas tertentu
export async function getJadwalByKelas(kelasId: string) {
    const res = await api.get(`/api/jadwal/kelas/${kelasId}`);
    return res.data;
}
