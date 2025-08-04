
import axios from "axios"
import { IncomingHttpHeaders } from "http"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export function createAxiosServer(headers: IncomingHttpHeaders) {
  const token = headers?.cookie
    ?.split("; ")
    ?.find((c) => c.startsWith("token="))
    ?.split("=")?.[1]

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  })

  return instance
}
