

import { useTranslation } from '@/context/LanguageProvider';
import './Modals.css';

export default function ConfirmationModal( {message, onSubmit, onClose} ) {

    const { lang } = useTranslation();

    function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        onSubmit();
    }

    function handleCancel(e) {
        e.preventDefault();
        e.stopPropagation();

        onClose();
    }

    return (
        <div className="modal-overlay" onMouseDown={handleCancel}>
            <div className="modal-container" onMouseDown={(e) => e.stopPropagation()}>
                <h1>{lang.files.modals.confirmation.accept}:</h1>

                <div className="modal-message">{message}</div>
                
                    
                <div className="modal-buttons">
                    <button type="submit" onClick={(e) => handleSubmit(e)} className="submit-button">{lang.files.modals.confirmation.accept}</button>
                    <button type="button" onClick={(e) => handleCancel(e)} className="cancel-button">{lang.files.modals.confirmation.cancel}</button>
                </div>

            </div>
        </div>
    )
}