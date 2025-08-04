import api from "@/lib/axios";

export interface MataPelajaran {
    id: string;
    nama: string;
    aktif: boolean;
}

export interface CreateMataPelajaranDto {
    nama: string;
    aktif?: boolean;
}

export interface UpdateMataPelajaranDto {
    nama?: string;
    aktif?: boolean;
}

// 🔹 Ambil semua mata pelajaran
export async function getAllMataPelajaran(): Promise<MataPelajaran[]> {
    const res = await api.get("/api/mata-pelajaran");
    return res.data;
}

// 🔹 Ambil mata pelajaran by ID
export async function getMataPelajaranById(id: string): Promise<MataPelajaran> {
    const res = await api.get(`/api/mata-pelajaran/${id}`);
    return res.data;
}

// 🔹 Tambah mata pelajaran baru
export async function createMataPelajaran(data: CreateMataPelajaranDto): Promise<MataPelajaran> {
    const res = await api.post("/api/mata-pelajaran", data);
    return res.data;
}

// 🔹 Update mata pelajaran (gunakan PATCH untuk parsial update)
export async function updateMataPelajaran(
    id: string,
    data: UpdateMataPelajaranDto
): Promise<MataPelajaran> {
    const res = await api.patch(`/api/mata-pelajaran/${id}`, data);
    return res.data;
}

// 🔹 Hapus mata pelajaran
export async function deleteMataPelajaran(id: string): Promise<void> {
    await api.delete(`/api/mata-pelajaran/${id}`);
}
