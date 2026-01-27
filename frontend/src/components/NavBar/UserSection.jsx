'use client';

import { useState } from 'react'
import { useRouter } from "next/navigation";

import { useTranslation } from "@/context/LanguageProvider";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

import axios from 'axios';

export default function UserSection({ username }) {

    const [needConfirm, setNeedConfirm] = useState(false);

    const { lang } = useTranslation();
    const router = useRouter();

    async function handleLogout() {
        try {
            await axios.patch('/api/auth/logout');

            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div className="navbar-footer-user-wrapper flex items-center">
            <div className="navbar-footer-user">
                <i className="fa-regular fa-user mr-3"></i>{username}
                
                <button className="logout-btn ml-3" title={lang.navbar.logout} onClick={() => setNeedConfirm(true)} >
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>

                {needConfirm && <ConfirmationModal message={lang.navbar.logoutMessage} onSubmit={handleLogout} onClose={() => setNeedConfirm(false)} /> }
            </div>
        </div>
    )
}