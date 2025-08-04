import api from "@/lib/axios";
import { Guru, GuruWithUser } from "@/interfaces/guru";
import { editGuruSchema } from "@/validations/guruSchema";
import z from "zod";



export type EditGuruValues = z.infer<typeof editGuruSchema>;


export async function getAllGuru(): Promise<Guru[]> {
  const res = await api.get("/api/guru");
  return res.data;
}

export async function getGuruById(id: string): Promise<GuruWithUser> {
  const res = await api.get(`/api/guru/${id}`);
  return res.data;
}

export async function createGuruWithUser(data: Partial<Guru>) {
  const res = await api.post("/api/guru", data);
  return res.data;
}

export async function updateGuruWithUser(data: EditGuruValues) {
  const res = await api.patch(`/api/guru/${data.id}`, data);
  return res.data;
}

export async function deleteGuru(id: string) {
  const res = await api.delete(`/api/guru/${id}`);
  return res.data;
}
