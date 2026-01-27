
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getUsername() {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_session');

    const user = {};

    // Get username from session cookie
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const { payload } = await jwtVerify(token.value, secret);
            user.name = payload.login;
        } catch (error){
            console.error(`[Error]: Couldn't get client username:\n${error}`)
            user.name = "Unknown";
        }
    }

    return user;
}

export async function getGroup() {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_session');

    if(!token) return "Unknown";

    try {
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token.value, secret);
        
        return payload.group;
    } catch(error) {
        console.error(`[Error]: Couldn't get client group:\n${error}`);
        return "Unknown";
    }
}
