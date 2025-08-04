// interfaces/orangTua.ts

// import { Anak } from "./anak"; // jika kamu punya relasi ke anak, sesuaikan
import { Roles } from "@/constants/common"; // enum: ADMIN | GURU | ORANG_TUA | WALI_KELAS
import z from "zod";

// Representasi data siswa (anak)
export interface Anak {
  id: string;
  namaDepan: string;
  namaTengah?: string | null;
  namaBelakang?: string | null;
  nisn?: string | null;
  nis?: string | null;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
  alamat?: string | null;
}


// Struktur data utama yang dikembalikan dari API
export interface OrangTua {
  id: string;
  nama: string;
  pekerjaan: string;
  alamat: string;
  user: {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: keyof typeof Roles;
  };
  anak?: Anak[]; // opsional jika ingin termasuk data anak
}

// Payload untuk membuat data orang tua baru
export interface CreateOrangTuaPayload {
  user: {
    username: string;
    email: string;
    phoneNumber?: string;
  };
  nama: string;
  pekerjaan: string;
  alamat: string;
}

// Payload untuk update data orang tua
export interface UpdateOrangTuaPayload {
  user: {
    username?: string;
    email?: string;
    phoneNumber?: string;
  };
  nama?: string;
  pekerjaan?: string;
  alamat?: string;
}


export interface OrangTuaWithUserAndAnak {
  id: string;
  nama: string;
  user: {
    id: string;
    username: string;
    email?: string;
    phoneNumber?: string;
  };
  anak: Anak[];
}


export const orangTuaSchema = z.object({
  id: z.string(),
  nama: z.string().min(3, "Nama wajib diisi"),
  user: z.object({
    id: z.string(),
    username: z.string().min(3, "Username wajib diisi"),
    email: z.string().email("Email tidak valid"),
    phoneNumber: z.string().optional(),
  }),
});