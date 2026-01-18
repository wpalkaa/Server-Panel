
'use client';

import { createContext, useState, useContext, useEffect } from "react";
// import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

import pl from '@/locales/pl.json';
import en from '@/locales/en.json';


const languages = {pl, en}
const LanguageContext = createContext();

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

        // If in localStorage, set new locale
        if( savedLocale && languages[savedLocale]) setLocale(savedLocale);
        // If first visit - not localStorage - set pl
        else localStorage.setItem('app_lang', 'pl');

        setIsLoaded(true);
    }, []);

    return (!
        isLoaded 
            ? <LoadingScreen />
            : (
                <LanguageContext value={{ lang, locale, changeLanguage }}>
                    {children}
                </LanguageContext>
            )
    );
}

// Translation hook
export const useTranslation = () => useContext(LanguageContext);