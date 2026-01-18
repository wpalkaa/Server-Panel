
import UserCard from "./UserCard";
import './UsersList.css';

export default function UsersList( {users} ) {

    return (
        <>
            {users.map( (u) => <UserCard key={u.login} user={u}/> )}
        </>
    )
}