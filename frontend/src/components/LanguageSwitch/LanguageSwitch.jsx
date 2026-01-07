
import { useTranslation } from "@/context/LanguageProvider";
import './LanguageSwitch.css';
import { useState } from "react";

const languagesList = [
    { id: 'pl', label: "PL" },
    { id: "en", label: "ENG"}
]

export default function LanguageSwitch() {

    const { locale, changeLanguage } = useTranslation();
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div className="lang-switch" onClick={() => setIsOpened(prev => !prev)} >
            <i className="fa-solid fa-globe"></i>
            {isOpened && (<div className="lang-list">
                {languagesList.map( (lang) => 
                    <button 
                        key={lang.id}
                        className={`lang-button ${locale === lang.id ? "active" : ""}`}
                        onClick={() => changeLanguage(lang.id)}
                    >
                        <img src={`/icons/${lang.id}.svg`} height={24} width={24} />{lang.label}
                    </button>   
                )}

            </div>
            )}
        </div>
    )
}