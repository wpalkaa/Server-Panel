
'use client';

import { createContext, useState, useContext, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

import pl from '@/locales/pl.json';
import en from '@/locales/en.json';


const languages = {pl, en}
const LanguageContext = createContext({
    lang: 'pl',
    locale: 'pl',
    changeLanguage: (locale) => {},
});

export function LanguageProvider( {children} ) {

    const [locale, setLocale] = useState('pl');
    const [isLoaded, setIsLoaded] = useState(false);

    const lang = languages[locale];

    function changeLanguage(newLocale) {
        if(languages[newLocale]) {
            setLocale(newLocale);
            localStorage.setItem('app_lang', newLocale);
        };
    }

    // Get langauge from localstorage
    useEffect( () => {
        const savedLocale = localStorage.getItem('app_lang');

        if( savedLocale && languages[savedLocale]) setLocale(savedLocale);
        setIsLoaded(true);
    }, []);

    return (!
        isLoaded 
            ? <div className='loading-screen'><LoadingSpinner /></div>
            : (
                <LanguageContext value={{ lang, locale, changeLanguage }}>
                    {children}
                </LanguageContext>
            )
    );
}

// Translation hook
export const useTranslation = () => useContext(LanguageContext);