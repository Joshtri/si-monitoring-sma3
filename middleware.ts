import { NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
    role?: string
    exp?: number
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const token = request.cookies.get("token")?.value

    let userRole: string | undefined = undefined

    if (token) {
        try {
            const decoded = jwtDecode<DecodedToken>(token)
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                console.warn("Token expired")
            } else {
                userRole = decoded.role
            }
        } catch (err) {
            console.error("Failed to decode token:", err)
        }
    }

    // Redirect /dashboard ke per-role dashboard
    if (pathname === "/dashboard" && userRole) {
        const rolePath = {
            ADMIN: "/admin/dashboard",
            GURU: "/guru/dashboard",
            WALI_KELAS: "/wali-kelas/dashboard",
            ORANG_TUA: "/orang-tua/dashboard",
        }[userRole]

        if (rolePath) {
            return NextResponse.redirect(new URL(rolePath, request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
}
