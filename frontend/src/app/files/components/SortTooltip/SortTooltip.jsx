
import { SORT_METHODS } from "@/app/files/config"
import { useTranslation } from "@/context/LanguageProvider"
import './SortTooltip.css';
import { useState } from "react";

export default function SortModal( { setSortMethod } ) {

    const [selectedMethod, setSelectedMethod] = useState(SORT_METHODS[0].id);
    const { lang } = useTranslation();

    function handleMethodChange(methodId) {
        const [ key, order ] = methodId.split('_');
        setSelectedMethod(methodId);
        setSortMethod( { key, order } );
    };

    return (
        <div className="sort-container">
            <h1>{lang.files.sort.title}</h1>
            {SORT_METHODS.map( (method) =>
                <div key={method.id} className="sort-method-item"> 
                    <input 
                        type="radio" 
                        name='sort-method' 
                        value={method.id} 
                        id={method.id} 
                        checked={selectedMethod === method.id} 
                        onChange={() => handleMethodChange(method.id)}
                    />
                    <label htmlFor={method.id}>{lang.files.sort[method.id]}</label>
                </div>
            )}
        </div>
    )
}