
import { getGroup } from '@/lib/getClientInfo';
import UsersList from "./components/UsersList/UsersList";

async function getUsers() {
    try {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
        const API_URL = new URL('/api/users', baseURL);

        const response = await fetch(API_URL);

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        };

        const data = await response.json();
        
        return data.data || []; 

    } catch (error) {
        console.error("Error: Couldn't fetch users data:\n", error.message);
        return [];
    };
}

export default async function UsersPage() {

    const clientGroup = await getGroup();


    const users = await getUsers();

    return (
            <div className="users-list">
                <UsersList users={users} isAdmin={clientGroup === 'admin'} />
            </div>
    )
}