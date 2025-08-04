import axios from "@/lib/axios";

export interface CreateUserDto {
    username: string;
    password: string;
    email?: string;
    phoneNumber?: string;
    role: "ADMIN" | "GURU" | "WALI_KELAS" | "ORANG_TUA";
}

export interface UpdateUserDto {
    username?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    role?: "ADMIN" | "GURU" | "WALI_KELAS" | "ORANG_TUA";
}

// ✅ GET all users
export async function getUsers() {
    const res = await axios.get("/api/users");
    return res.data;
}

// ✅ GET single user by ID
export async function getUserById(id: string) {
    const res = await axios.get(`/api/users/${id}`);
    return res.data;
}

// ✅ CREATE new user
export async function createUser(data: CreateUserDto) {
    const res = await axios.post("/api/users", data);
    return res.data;
}

// ✅ UPDATE user by ID
export async function updateUser(id: string, data: UpdateUserDto) {
    const res = await axios.patch(`/api/users/${id}`, data);
    return res.data;
}

// ✅ DELETE user by ID
export async function deleteUser(id: string) {
    const res = await axios.delete(`/api/users/${id}`);
    return res.data;
}
