import { verifyToken } from "./jwt"
import { cookies } from "next/headers"

export function getAuthUserFromCookie() {
    const token = cookies().get("token")?.value
    return token ? verifyToken(token) : null
}


// export async function getAuthUserFromCookie() {
//   const cookieStore = await cookies(); // await the promise to get the cookie store
//   const token = cookieStore.get("token")?.value;
//   return token ? verifyToken(token) : null;
// }

// export async function getAuthUserFromCookie() {
//   const cookieStore = cookies();
//   const token = cookieStore.get("token")?.value;
//   return token ? verifyToken(token) : null;
// }


export function getAuthUserFromHeader(req: Request) {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]
    return token ? verifyToken(token) : null
}
