
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

    // Custom claim set via Auth0 Action, e.g.:
    //   event.accessToken.setCustomClaim('https://server-panel/group', event.user.app_metadata.group)
    const group = session.user["https://server-panel/group"] || "user";

    return group;
}
