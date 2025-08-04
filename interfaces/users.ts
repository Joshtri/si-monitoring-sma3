export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  role: "ADMIN" | "GURU" | "WALI_KELAS" | "ORANG_TUA";
}
