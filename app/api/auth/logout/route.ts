import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    try {
        const cookieStore = await cookies()

        // Hapus cookie token
        cookieStore.delete("token")

        return NextResponse.json({
            message: "Logout berhasil",
        })
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
    }
}
