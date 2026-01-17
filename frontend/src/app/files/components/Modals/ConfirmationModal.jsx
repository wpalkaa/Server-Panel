
import './Modals.css';

export default function ConfirmationModal( {message, onSubmit, onClose} ) {

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
                <h1>Potwierdź:</h1>

                <div className="modal-message">{message}</div>
                
                    
                <div className="modal-buttons">
                    <button type="submit" onClick={(e) => handleSubmit(e)} className="submit-button">Potwierdź</button>
                    <button type="button" onClick={(e) => handleCancel(e)} className="cancel-button">Anuluj</button>
                </div>

            </div>
        </div>
    )
}