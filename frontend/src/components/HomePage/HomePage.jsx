'use client'

import { useState, useEffect } from 'react';
import { useTranslation } from "@/context/LanguageProvider";
import './HomePage.css';

export default function HomePage( { username } ) {

    const [currentDate, setCurrentDate] = useState(new Date());
    const { lang, locale } = useTranslation();

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
                    <img src="default-avatar-icon.jpg"></img>
                </div>

                <div className="date">
                    {currentDate ? currentDate.toLocaleString( locale ) : '--:--:---- --:--'}
                </div>
            </div>
        </div>
    );   
}