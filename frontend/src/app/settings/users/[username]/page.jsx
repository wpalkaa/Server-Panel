
import { useTranslation } from '@/context/LanguageProvider';
import UserInfoCard from './components/UserInfoCard';
import './UserInfo.css';

export default async function UserInfo( {params} ) {

    const { username } = await params;

    const user = {
        username,
        avatar : '/default-avatar-icon.jpg',
    }

    return (
        <div className="user-info-page">
            <UserInfoCard user={user} />        
        </div>
    )
}