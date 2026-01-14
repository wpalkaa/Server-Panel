
import UserCard from "./UserCard";
import './UsersList.css';

export default function UsersList( {users} ) {

    return (
        <div className="users-list">
            {users.map( (u) => <UserCard key={u} user={u}/> )}
        </div>
    )
}