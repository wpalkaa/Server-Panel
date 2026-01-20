'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/LanguageProvider';
import '../UserInfo.css';

export default function UserInfoCard({ user }) {

    const { lang } = useTranslation();

    return (
        <div className="user-info-card">
            <div className="user-previous-page w-full flex justify-start text-slate-400">
                <Link href="/settings/users">
                    <i className="fa-solid fa-arrow-left mr-2"></i>{lang.settings.users.info.previousPage}
                </Link>
            </div>

            <h1 className="username">{user.username}</h1>

            <div className="user-avatar">
                <img src={user.avatar} alt="User Avatar" />
            </div>

            <div className="user-actions">
                <button className="edit-user-button">{lang.settings.users.info.editUser}</button>
                <button className="delete-user-button">{lang.settings.users.info.deleteUser}</button>
            </div>
        </div>
    );
}