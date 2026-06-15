'use client'

import { useState, useEffect } from 'react';
import { useTranslation } from "@/context/LanguageProvider";
import { useUser } from '@auth0/nextjs-auth0/client';
import './HomePage.css';

export default function HomePage( { username } ) {

    const [currentDate, setCurrentDate] = useState(new Date());
    const { lang, locale } = useTranslation();

    const { user } = useUser();

    const imgHref = user?.picture;

    useEffect( () => {
        setCurrentDate(new Date());

        const intervalId = setInterval( () => 
            setCurrentDate(new Date()
    ), 1000 );

        return () => clearInterval(intervalId);
    }, [])

    return (
        <div className="main-page">
            <div className="main-page-content">
                <h1 className="welcome-message">{`${lang.mainPage.welcomeMessage} ${username}`}!</h1>
                
                <div className="photo-block">
                    {imgHref ? (<img src={imgHref} alt="Profile picture"/>) : (<img src="default-avatar-icon.jpg" alt="Default avatar"/>)}
                </div>

                <div className="date">
                    {currentDate ? currentDate.toLocaleString( locale ) : '--:--:---- --:--'}
                </div>
            </div>
        </div>
    );   
}