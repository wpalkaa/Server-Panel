
import './UsersList.css';
import Link from 'next/link';

export default function UserCard( {userData} ) {

    const avatar = userData.avatar || '/default-avatar-icon.jpg'

    return (
        <Link href={`/settings/users/${userData.login}`} className="user-card-link">
            <div className="user-card">
                <div className="user-photo">
                    <img src={avatar}></img>
                </div>

                <div className="user-name">{userData.login}</div>

            </div>
        </Link>
    )
}