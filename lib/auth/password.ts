import bcrypt from "bcryptjs"

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed)
}
