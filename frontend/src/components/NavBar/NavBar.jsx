
'use client';

import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";
import NavList from "./NavList";
import UserSection from "./UserSection";

export default function NavBar( {username} ) {


    return (
        <aside className="navbar">
            <div className="navbar-logo">WP</div>
            <NavList/>

            <footer className="navbar-footer">
                { username && <UserSection username={username} /> }

                <LanguageSwitch/> 
            </footer>
        </aside>  
    )
}