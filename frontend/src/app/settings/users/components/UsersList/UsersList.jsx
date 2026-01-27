'use client';
import { useState } from "react";
import UserCard from "./UserCard";
import './UsersList.css';

export default function UsersList( {users} ) {

    const [currentPage, setCurrentPage] = useState(1);
    const maxUsersPerPage = 10;

    const firstUserIndex = (currentPage - 1) * maxUsersPerPage
    const totalPages = Math.ceil(users.length / maxUsersPerPage);

    const currentUsers = users.slice(firstUserIndex, firstUserIndex + maxUsersPerPage);

    return (
        <>
            <div className="users-list-wrapper">
                {currentUsers.map( (u) => <UserCard key={u.login} userData={u}/> )}
            </div>
            {totalPages > 1 && (
                <div className="pagination-bar">
                    <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev-1)} >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>

                    <span className="pagination-info text-[#94a3b8]">{currentPage}/{totalPages}</span>

                    <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev+1)} >
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            )}
        </>
    )
}