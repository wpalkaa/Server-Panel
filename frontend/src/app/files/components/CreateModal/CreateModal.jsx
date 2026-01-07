
import { useState } from 'react';
import './CreateModal.css';

export default function CreateModal( {onSubmit, onCancel, isDirectory} ) {


    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toCreate = isDirectory ? "katalog" : "plik"


    function handleChange(e) {
        setError('');
        const name = e.target.value;
        const illegalSymbols = /[\\/:*?"<>|]/;

        if( name.trim().length === 0 ) {
            setError("Nazwa nie może być pusta");
        } else if( illegalSymbols.test(name) ) {
            setError("Nazwa zawiera niedowzwolone znaki: \\,/,:,*,?,<,>,|");
        } else {
            setError('');
        }

        setFileName(name);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if(error) {
            console.log(`Error: Can't submit:\n${error}`);
            return;
        };

        setIsLoading(true);
        try {
            await onSubmit(fileName);
        } catch (error) {
            setError(error?.response?.data?.message || `Nieznany błąd`);
        } finally {
            setIsLoading(false);
        }

        // onSubmit(fileName)
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h1>Utwórz nowy {toCreate}:</h1>
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
                        <button type="submit" className="submit-button" disabled={isLoading || error} >Utwórz {toCreate}</button>
                        <button type="button" onClick={onCancel} className="cancel-button">Anuluj</button>
                    </div>

                </form>
            </div>
        </div>
    )
}