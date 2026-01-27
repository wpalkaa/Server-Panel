
import { notFound } from 'next/navigation';
import { getGroup } from '@/lib/getClientInfo';


import UserInfoCard from './components/UserInfoCard';
import './UserInfo.css';


async function getUserData(username) {
    try {
        const API_URL = new URL(`/api/users/${username}`, process.env.NEXT_PUBLIC_SERVER_URL);
        const response = await fetch(API_URL);

        if(!response.ok) return null;

        const data = await response.json();

        return data.data;
    } catch(error) {
        //
        return null;
    }
}

export default async function UserInfo( {params} ) {
    const clientGroup = await getGroup();
    console.log(clientGroup)
    const { username } = await params;

    const userData = await getUserData(username);
    if(!userData) notFound();

    return (
        <div className="user-info-page">
            <UserInfoCard userData={userData} isAdmin={clientGroup === 'admin'} />        
        </div>
    )
}