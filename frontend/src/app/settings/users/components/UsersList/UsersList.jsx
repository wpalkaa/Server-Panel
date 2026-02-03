'use client';
import { useState, useEffect } from "react";

import UserCard from "./UserCard";
import CreateUserCard from "./CreateUserCard";
import { useTranslation } from "@/context/LanguageProvider";
import './UsersList.css';

export default function UsersList( {users: allUsers, isAdmin} ) {

    const { lang } = useTranslation();

    const [users, setUsers] = useState(allUsers);

    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const maxUsersPerPage = 11;

    const firstUserIndex = (currentPage - 1) * maxUsersPerPage
    const totalPages = Math.ceil(users.length / maxUsersPerPage);

    const currentUsers = users.slice(firstUserIndex, firstUserIndex + maxUsersPerPage);



    function addUser(userData) {
        setUsers((prev) => [...prev, userData]);
    };

    useEffect(() => {
        async function fetchFilteredUsers() {
            try {
                const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
                const API_URL = new URL('/api/users', baseURL);

                const response = await fetch(`${API_URL}/?search=${searchValue}`);

                if(!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                };

                const data = await response.json();
                
                setUsers(data.data)

            } catch (error) {
                console.error("Error: Couldn't fetch users data:\n", error.message);
                setUsers([]);
            };
        }

        const delay = setTimeout(() => fetchFilteredUsers(), 500);

        return () => clearTimeout(delay);
    }, [searchValue]);

    return (
        <>
            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input 
                        type="text" 
                        placeholder={lang.settings.users.searchBarPlaceholder}
                        className="search-input"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>

            <div className="users-list-wrapper">
                {currentUsers.map( (u) => <UserCard key={u.login} userData={u}/> )}

                {isAdmin && <CreateUserCard onCreate={addUser}/>}
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