import api from "@/lib/axios";
import { Guru, GuruWithUser } from "@/interfaces/guru";
import { editGuruSchema } from "@/validations/guruSchema";
import z from "zod";


export interface AbsenSiswaItem {
  siswaKelasId: string;
  // namaDepan: string;
  // namaTengah?: string;
  // namaBelakang?: string;

  nama: string;
  nis: string;
  status?: "HADIR" | "SAKIT" | "IZIN" | "ALPHA";
}

export interface KelasAbsensiHariIni {
  kelasId: string;
  kelas: string;
  mapel: string;
  jamKe: number;
  siswa: AbsenSiswaItem[];
}


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



/// Function to get Mata Pelajaran for Guru that is logged in

export async function getGuruMataPelajaran() {
  const res = await api.get("/api/guru/me/mata-pelajaran");
  return res.data;
}



// Ambil daftar siswa untuk absensi hari ini
export async function getSiswaHariIni(): Promise<KelasAbsensiHariIni[]> {
  const res = await api.get("/api/guru/absensi/siswa-hari-ini");
  return res.data;
}

// Ambil daftar kelas yang diajar hari ini
export async function getKelasHariIni() {
  const res = await api.get("/api/guru/absensi/kelas-hari-ini");
  return res.data;
}

// Ambil daftar siswa berdasarkan kelas yang dipilih
export async function getSiswaByKelasHariIni(kelasId: string) {
  const res = await api.get(`/api/guru/absensi/siswa-hari-ini?kelasId=${kelasId}`);
  return res.data;
}

// Kirim data absensi
// services/guruService.ts
export async function submitAbsensi(absensiData: AbsenSiswaItem[]) {
  const res = await api.post("/api/guru/absensi", { absensiData }); // ✅ wrap dengan object
  return res.data;
}


export async function getKelasYangDiajar() {
  const res = await api.get("/api/guru/absensi/kelas-diajar");
  return res.data;
}

export async function getRiwayatAbsensiByKelas(kelasId: string) {
  const res = await api.get(`/api/guru/absensi/riwayat?kelasId=${kelasId}`);
  return res.data;
}


// Ambil detail riwayat absensi berdasarkan kelasId
export async function getDetailRiwayatAbsensi(kelasId: string) {
  const res = await api.get(`/api/guru/absensi/riwayat/${kelasId}`);
  return res.data;
}