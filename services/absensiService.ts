// File: services/absensiService.ts
import api from "@/lib/axios";

export async function getSiswaAbsenHariIni() {
  const res = await api.get("/api/guru/absensi/siswa-hari-ini");
  return res.data;
}

export async function postAbsensi(data: { siswaKelasId: string; status: string }[]) {
  await api.post("/api/guru/absensi", data);
}
