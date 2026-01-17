
'use client';
import Link from "next/link";
const { usePathname } = require("next/navigation");

import { useTranslation } from "@/context/LanguageProvider";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";

export default function NavBar( {username} ) {

    const { lang } = useTranslation();
    const pathname = usePathname();

    const isActive = (path) => {
        if( path === "/" ) return pathname === "/";
        return pathname.startsWith(path);
    }

    return (
        <aside className="navbar">
            <div className="navbar-logo">WP</div>
            <ul className='navbar-list'>
                <li className={`navbar-list-item ${isActive("/") ? "active" : ""}`}><Link href="/"><i className="fa-regular fa-house"></i>{lang.navbar.home}</Link></li>
                <li className={`navbar-list-item ${isActive("/files") ? "active" : ""}`}><Link href="/files"><i className="fa-regular fa-file"></i>{lang.navbar.files}</Link></li>
                <li className={`navbar-list-item ${isActive("/resources") ? "active" : ""}`}><Link href="/resources"><i className="fa-solid fa-microchip"></i>{lang.navbar.resources}</Link></li>
                <li className={`navbar-list-item ${isActive("/settings") ? "active" : ""}`}><Link href="/settings"><i className="fa-solid fa-sliders"></i>{lang.navbar.settings}</Link></li>
            </ul>

            <footer className="navbar-footer">
                <div className="navbar-footer-user">
                    <i className="fa-regular fa-user mr-3"></i>{username}
                </div>
                <LanguageSwitch/> 
            </footer>
        </aside>  
    )
}