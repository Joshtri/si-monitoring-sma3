import api from "@/lib/axios";

// Ambil semua tahun ajaran
export async function getAllTahunAjaran() {
  const res = await api.get("/api/tahun-ajaran");
  return res.data;
}

// Tambah tahun ajaran baru
export async function createTahunAjaran(data: { tahun: string; aktif?: boolean }) {
  const res = await api.post("/api/tahun-ajaran", data);
  return res.data;
}

// Update tahun ajaran (ubah nama / aktifkan)
export async function patchTahunAjaran(id: string, data: { tahun?: string; aktif?: boolean }) {
  const res = await api.patch(`/api/tahun-ajaran/${id}`, data);
  return res.data;
}

// Hapus tahun ajaran
export async function deleteTahunAjaran(id: string) {
  const res = await api.delete(`/api/tahun-ajaran/${id}`);
  return res.data;
}

// Ambil detail tahun ajaran by ID (jika nanti kamu butuh untuk edit)
export async function getTahunAjaranById(id: string) {
  const res = await api.get(`/api/tahun-ajaran/${id}`);
  return res.data;
}
