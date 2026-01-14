
import './UsersList.css';

export default function UserCard( {user} ) {

    return (
        <div className="user-card">
            <div className="user-photo">
                <img src='/default-avatar-icon.jpg'></img>
            </div>

            <div className="user-name">{user.login}</div>

        </div>
    )
}