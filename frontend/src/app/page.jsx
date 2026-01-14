
import { getUser } from "@/lib/getUser";
// import Username from "@/components/Username/Username";

import HomePage from "@/components/HomePage/HomePage";

export default async function Home() {

    const user = await getUser();


    return (
        <HomePage username={user.name} />
    );
}