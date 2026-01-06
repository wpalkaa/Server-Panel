
import { useState } from 'react';

import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import './RenameModal.css';

export default function RenameModal( {file, onSubmit, onClose} ) {


    const fileExtension = file.name.split('.').pop();

    const [newName, setNewName] = useState(file.name);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [warn, setWarn] = useState('')
    const [needApprove, setNeedApprove] = useState(false);




    function handleChange(e) {
        setError('');
        const name = e.target.value;
        const illegalSymbols = /[\\/:*?"<>|]/;

        if( name.trim().length === 0 ) {
            setError("Nazwa nie może być pusta");
        } else if( illegalSymbols.test(name) ) {
            setError("Nazwa zawiera niedowzwolone znaki: \\,/,:,*,?,<,>,|");
        } else if( !file.isDirectory && fileExtension !== name.split('.').pop() && file.name.indexOf('.') !== 0 ) {
            setWarn('Uwaga: Zmieniasz rozszerzenie pliku')
        }
        else {
            setError('');
        }

        setNewName(name);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        
        if(error) {
            console.log(`Error: Can't submit:\n${error}`);
            return;
        };
        
        if( warn && !needApprove ) {
            setNeedApprove(true);
            return;
        };
        
        setIsLoading(true);
        try {
            await onSubmit(newName);
        } catch (error) {
            setError(error?.response?.data?.message || `Nieznany błąd`);
        } finally {
            setIsLoading(false);
        }
    }

    function selectOnlyFileName(e) {
        const extensionLocation = e.target.value.lastIndexOf('.');

        // Check if not hidden and has extension
        if( extensionLocation > 0 ) {
            e.target.setSelectionRange(0, extensionLocation);
        } else {
            e.target.select()
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h1>Zmień nazwę pliku:</h1>
                <h2>{file.name}</h2>
                <form className="modal-form" onSubmit={(e) => handleSubmit(e)}>
                    <input 
                        autoFocus
                        type="text"
                        value={newName}
                        onChange={ (e) => handleChange(e) }
                        onFocus={ (e) => selectOnlyFileName(e) }
                    />
                    
                    <div className="form-error" style={{color: 'red', fontSize: '0.7rem', visibility: error ? "visible" : "hidden"}}> 
                        <i className="fa-solid fa-x"></i> {error}
                    </div>
                    
                    <div className="modal-buttons">
                        <button type="submit" className="submit-button" disabled={isLoading || error || needApprove} >Zmień nazwę</button>
                        <button type="button" onClick={onClose} className="cancel-button">Anuluj</button>
                    </div>

                </form>

            </div>

            { needApprove && (
                <ConfirmationModal 
                    message={warn} 
                    onSubmit={ () => {
                        setWarn('')
                        setNeedApprove(false)
                    }}
                    onCancel={() => {
                        setWarn('');
                        setNeedApprove(false)
                        setError('Zmień rozszerzenie pliku')
                    }} 
                />)
            }

        </div>
    )
}