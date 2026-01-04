
import './ConfirmationModal.css';

export default function ConfirmationModal( {message, onSubmit, onCancel} ) {

    function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        onSubmit();
    }

    function handleCancel(e) {
        e.preventDefault();
        e.stopPropagation();

        onCancel();
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
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