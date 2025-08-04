import axios from "@/lib/axios"

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  message: string
  role: string
  user?: {
    id: string
    username: string
    email: string
    role: string
  }
}

export async function login(data: LoginPayload): Promise<LoginResponse> {
  const response = await axios.post("/api/auth/login", data)
  return response.data
}

export async function logout(): Promise<void> {
  await axios.post("/api/auth/logout")
}

export async function getCurrentUser() {
  const response = await axios.get("/api/auth/me")
  return response.data.user
}
