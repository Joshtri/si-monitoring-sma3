// import { Role } from "@/app/generated/prisma"
import { Role } from "@prisma/client"
import jwt from "jsonwebtoken"
// import { Role } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET not defined or too short!")
}

export interface TokenPayload {
  id: string
  sub: string
  username: string
  role: Role
  iat?: number
  exp?: number
}

export function generateToken(payload: TokenPayload, expiresIn = "1d") {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as TokenPayload
  } catch {
    return null
  }
}
