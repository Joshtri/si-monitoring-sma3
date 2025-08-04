import * as z from "zod";

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
