
import './UserInfo.css';

export default async function UserInfo( {params} ) {


    const { username } = await params;

    const user = {
        username,
        avatar : '/default-avatar-icon.jpg',
    }

    return (
        <div className="user-info-page">
            <div className="user-info-card">
                <h1 className="username">{user.username}</h1>

                <div className="user-avatar">
                    <img src={user.avatar} alt="User Avatar" />
                </div>

                <div className="user-actions">
                    <button className="edit-user-button">Edit User</button>
                    <button className="delete-user-button">Delete User</button>
                </div>
            </div>
        </div>
    )
}