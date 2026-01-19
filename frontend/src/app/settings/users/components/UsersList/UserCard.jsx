
import './UsersList.css';
import Link from 'next/link';

export default function UserCard( {user} ) {

    return (
        <Link href={`/settings/users/${user.login}`} className="user-card-link">
            <div className="user-card">
                <div className="user-photo">
                    <img src='/default-avatar-icon.jpg'></img>
                </div>

                <div className="user-name">{user.login}</div>

            </div>
        </Link>
    )
}