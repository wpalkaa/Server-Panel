
import HomePage from "@/components/HomePage/HomePage";
import { getUsername } from "@/lib/getClientInfo";

export default async function Home() {

    const user = await getUsername();


    return (
        <HomePage username={user.name} />
    );
}