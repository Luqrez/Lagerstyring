import "../styles/Button.css";

// Standard knap der bruges i hele systemet
// Primary: Bruges til primære handlinger som "Gem", "Opret ny"
// Secondary: Bruges til sekundære handlinger som "Annuller", "Tilbage"
// Delete: Bruges kun til permanente sletninger der kræver brugerbekræftelse
interface ButtonProps {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'delete';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
    return (
        <button className={`button ${variant}`} onClick={onClick}>
            {label}
        </button>
    );
}