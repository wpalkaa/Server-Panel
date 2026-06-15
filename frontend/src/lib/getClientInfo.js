
import { auth0 } from "@/lib/auth0";

export async function getUsername() {
    const session = await auth0.getSession();

    if (!session) return { name: null };

    const name = session.user.name || session.user.nickname || session.user.email || "Unknown";

    return { name };
}

export async function getGroup() {
    const session = await auth0.getSession();

    if (!session) return "user";

    // const group = session.user["https://server-panel/group"] || "user";
    const group = session.user[`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/group`] || "user";

    return group;
}
