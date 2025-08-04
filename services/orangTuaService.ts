import api from "@/lib/axios";
import {
  OrangTua,
  CreateOrangTuaPayload,
  UpdateOrangTuaPayload,
  OrangTuaWithUserAndAnak,
} from "@/interfaces/orang-tua";

// ✅ GET /api/orang-tua
export async function getAllOrangTua(): Promise<OrangTua[]> {
  const res = await api.get("/api/orang-tua");
  return res.data;
}

// ✅ GET /api/orang-tua/:id
export async function getOrangTuaById(id: string): Promise<OrangTuaWithUserAndAnak> {
  const res = await api.get(`/api/orang-tua/${id}`);
  return res.data;
}

// ✅ POST /api/orang-tua
export async function createOrangTua(payload: CreateOrangTuaPayload): Promise<OrangTua> {
  const res = await api.post("/api/orang-tua", payload);
  return res.data;
}

export async function updateOrangTuaWithUser(data: OrangTuaWithUserAndAnak) {
  const res = await api.patch(`/api/orang-tua/${data.id}`, data);
  return res.data;
}

// ✅ DELETE /api/orang-tua/:id
export async function deleteOrangTua(id: string): Promise<void> {
  await api.delete(`/api/orang-tua/${id}`);
}
