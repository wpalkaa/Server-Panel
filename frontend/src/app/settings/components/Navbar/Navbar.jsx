'use client';

import Link from "next/link";
import { useTranslation } from "@/context/LanguageProvider";
import './Navbar.css'

export default function Navbar() {
    
    const { lang } = useTranslation();

    return (
        <div className="settings-navbar">
            <ul>
                <li><Link href='/settings/users'>{lang.settings.navbar.users}</Link></li>
                {/* <li><Link href='/settings/myAccount'>{lang.settings.navbar.myAccount}</Link></li> */}
            </ul>
        </div>
    )

}