import { z } from "zod";

export const createGuruSchema = z.object({
    // USER fields
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    email: z.string().email("Email tidak valid"),
    phoneNumber: z.string().optional(),
    // role: z.literal("GURU"), // karena hanya bisa buat guru

    // GURU fields
    nama: z.string().min(3, "Nama tidak boleh kosong"),
    nip: z.string().min(5, "NIP minimal 5 karakter"),
});


export const editGuruSchema = z.object({
  id: z.string(),
  nama: z.string().min(3, "Nama wajib diisi"),
  nip: z.string().min(8, "NIP minimal 8 digit"),
  user: z.object({
    id: z.string(),
    username: z.string().min(3),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
  }),
});

export const updateGuruSchema = z.object({
  id: z.string(),
  nama: z.string().min(3),
  nip: z.string().min(8),
  user: z.object({
    username: z.string().min(3),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
  }),
})