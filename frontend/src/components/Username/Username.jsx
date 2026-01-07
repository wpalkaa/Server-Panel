
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function Username() {
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
            console.error(`[Error]: Couldn't get username:\n${error}`)
        }
    }

    return (
        <div>{user.name}</div>
    );
}
