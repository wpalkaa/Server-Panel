'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/LanguageProvider';
import '../UserInfo.css';

export default function UserInfoCard({ userData, isAdmin }) {

    const { lang } = useTranslation();
    const avatar = userData.avatar || '/default-avatar-icon.jpg'

    return (
        <div className="user-info-card">
            <div className="user-previous-page w-full flex justify-start text-slate-400">
                <Link href="/settings/users">
                    <i className="fa-solid fa-arrow-left mr-2"></i>{lang.settings.users.info.previousPage}
                </Link>
            </div>

            <h1 className="username">{userData.login}</h1>

            <div className="user-avatar">
                <img src={avatar} alt="User Avatar" />
            </div>

            <div className="user-groups">
                <span className="group-label">{lang.global.groups.title}:</span>
                <span className={`group-badge group-${userData.group}`}>
                    {lang.global.groups[userData.group]}
                </span>
            </div>

            {isAdmin && (
                <div className="user-actions">
                    <button className="edit-user-button">{lang.settings.users.info.editUser}</button>
                    <button className="delete-user-button">{lang.settings.users.info.deleteUser}</button>
                </div>
            )}
        </div>
    );
}