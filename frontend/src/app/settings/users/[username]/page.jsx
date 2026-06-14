
import { notFound } from 'next/navigation';
import { getUsername, getGroup } from '@/lib/getClientInfo';

import UserInfoCard from './components/UserInfoCard';
import './UserInfo.css';


async function getUserData(username) {
    try {
        const API_URL = new URL(`/api/users/${username}`, process.env.BACKEND_URL);
        console.log("request: ", API_URL)
        const response = await fetch(API_URL);

        if(!response.ok) return null;

        const data = await response.json();

        return data.data;
    } catch(error) {
        const API_URL = new URL(`/api/users/${username}`, process.env.BACKEND_URL);
        console.error("APUURL:", API_URL, "ENV:", process.env.BACKEND_URL);
        console.error(`[Error]: Couldn't fetch user data for - ${username}:`, error);
        return null;
    }
}

export default async function UserInfo( {params} ) {
    const clientGroup = await getGroup();
    const clientLogin = await getUsername();
    
    const { username } = await params;

    const userData = await getUserData(username);
    if(!userData) notFound();

    return (
        <div className="user-info-page">
            <UserInfoCard userData={userData} isAdmin={clientGroup === 'admin'} clientLogin={clientLogin} />        
        </div>
    )
}