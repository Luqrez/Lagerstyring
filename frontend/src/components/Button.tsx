import "../styles/Button.css";

interface ButtonProps {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'delete'; // support for visual styles
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
    return (
        <button className={`button ${variant}`} onClick={onClick}>
            {label}
        </button>
    );
}


