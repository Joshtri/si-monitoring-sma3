import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

// Token storage (client-side only)
let authToken: string | null = null

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Set token manually
export function setToken(token: string) {
  authToken = token
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// Clear token (e.g. logout)
export function clearToken() {
  authToken = null
  delete api.defaults.headers.common["Authorization"]
}

// Attach token on each request (client-side only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && !config.headers["Authorization"]) {
    const token = authToken || localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
  }
  return config
})

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const { response } = err

    if (response?.status === 401) {
      // Optional: trigger logout or redirect
      console.warn("Unauthorized: Redirecting to login")
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/"
      }
    }

    if (response?.status === 403) {
      console.error("Forbidden access")
    }

    if (response?.status >= 500) {
      console.error("Server error")
    }

    return Promise.reject(err)
  }
)

export default api
