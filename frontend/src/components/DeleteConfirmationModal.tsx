import '../styles/Popup.css';
import { Button } from './Button';

// Sikkerhedsforanstaltning der kræver brugerbekræftelse ved permanent sletning
// Forhindrer utilsigtet tab af data og følger GDPR krav om datahåndtering
interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemCount: number;
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemCount }: DeleteConfirmationModalProps) {
    return (
        <>
            {isOpen && <div className="popup-overlay" onClick={onClose} />}

            <div className={`modal-centered ${isOpen ? 'open' : ''}`}>
                <div className="popup-header">
                    <h3>Bekræft sletning</h3>
                    <button
                        onClick={onClose}
                        className="close-button"
                        aria-label="Luk">
                        &times;
                    </button>
                </div>

                <div className="container">
                    <div className="confirmation-message">
                        <p>Er du sikker på, at du vil slette {itemCount} valgte varer?</p>
                    </div>
                    <div className="confirmation-buttons">
                        <Button label="Annuller" variant="secondary" onClick={onClose} />
                        <Button label="Slet" variant="delete" onClick={onConfirm} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteConfirmationModal; 