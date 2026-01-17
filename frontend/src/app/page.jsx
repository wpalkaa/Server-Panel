
import HomePage from "@/components/HomePage/HomePage";
import { getUser } from "@/lib/getUser";

export default async function Home() {

    const user = await getUser();


    return (
        <HomePage username={user.name} />
    );
}