
'use client';
import Link from "next/link";

import { useTranslation } from "@/context/LanguageProvider";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";

export default function NavBar( {username} ) {

    const { lang } = useTranslation();

    return (
        <aside className="navbar">
            <div className="navbar-logo">WP</div>
            <ul className='nav-list'>
                <li><Link href="/">{lang.navbar.home}</Link></li>
                <li><Link href="/files">{lang.navbar.files}</Link></li>
                <li><Link href="/resources">{lang.navbar.resources}</Link></li>
                <li><Link href="/settings">{lang.navbar.settings}</Link></li>
            </ul>

            {username}
            <LanguageSwitch/> 
        </aside>  
    )
}