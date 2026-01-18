
import { useState } from 'react';

import { useTranslation } from '@/context/LanguageProvider';
import './Modals.css';

export default function CreateModal( {onSubmit, onClose, isDirectory} ) {

    const { lang } = useTranslation();

    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    function handleChange(e) {
        setError('');
        const name = e.target.value;
        const illegalSymbols = /[\\/:*?"<>|]/;

        if( name.trim().length === 0 ) {
            setError(lang.errors.emptyString);
        } else if( illegalSymbols.test(name) ) {
            setError(lang.errors.illegalSymbols);
        } else {
            setError('');
        }

        setFileName(name);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if(error) {
            // console.log(`Error: Can't submit:\n${error}`);
            return;
        };

        setIsLoading(true);
        try {
            await onSubmit(fileName);
        } catch (error) {
            setError(error?.response?.data?.message || lang.errors.generic);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div className="modal-container" onMouseDown={(e) => e.stopPropagation()}>
                <h1>{isDirectory ? lang.files.modals.create.newDir : lang.files.modals.create.newFile}:</h1>
                <form className="modal-form" onSubmit={(e) => handleSubmit(e)}>
                    <input 
                        autoFocus
                        type="text"
                        value={fileName}
                        onChange={ (e) => handleChange(e) }
                    />
                    
                    <div className="form-error" style={{color: 'red', fontSize: '0.7rem', visibility: error ? "visible" : "hidden"}}> 
                        <i className="fa-solid fa-x"></i> {error}
                    </div>
                    
                    <div className="modal-buttons">
                        <button type="submit" className="submit-button" disabled={isLoading || error} >{lang.files.modals.create.createButton}</button>
                        <button type="button" onClick={onClose} className="cancel-button">{lang.files.modals.confirmation.cancel}</button>
                    </div>

                </form>
            </div>
        </div>
    )
}