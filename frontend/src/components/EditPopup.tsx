import '../styles/Popup.css';
import {Button} from '@/components/Button';
import {useEffect, useRef, useState} from 'react';

interface EditPopupProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        Id: number;
        Navn: string;
        Beskrivelse: string;
        Mængde: number;
        Minimum: number;
        Kategori: string;
        Lokation: string;
        Enhed: string;
    } | null;
    onItemUpdated: () => void;
}

function EditPopup({isOpen, onClose, item, onItemUpdated}: EditPopupProps) {
    const [formData, setFormData] = useState({
        navn: '',
        beskrivelse: '',
        maengde: 0,
        minimum: 0,
        kategori: '',
        lokation: '',
        enhed: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [options, setOptions] = useState<{ enheder: string[]; lokationer: string[]; kategorier: string[] }>(
        {enheder: [], lokationer: [], kategorier: []}
    );
    const [filtered, setFiltered] = useState<{ [key: string]: string[] }>({});
    const [activeIndex, setActiveIndex] = useState<{ [key: string]: number }>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load item data when selected item changes
    useEffect(() => {
        if (item) {
            setFormData({
                navn: item.Navn,
                beskrivelse: item.Beskrivelse,
                maengde: item.Mængde,
                minimum: item.Minimum,
                kategori: item.Kategori,
                lokation: item.Lokation,
                enhed: item.Enhed
            });
        }
    }, [item]);

    // Load dropdown options when popup opens
    useEffect(() => {
        if (isOpen) {
            fetchOptions();
        }
    }, [isOpen]);

    const fetchOptions = async () => {
        try {
            const response = await fetch('http://localhost:5212/api/options');
            if (!response.ok) {
                throw new Error('Failed to fetch options');
            }
            const data = await response.json();
            setOptions({
                enheder: data.Enheder,
                lokationer: data.Lokationer,
                kategorier: data.Kategorier
            });
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maengde' || name === 'minimum' ? Number(value) : value
        }));
    };

    const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        setFormData(prev => ({...prev, beskrivelse: target.value}));

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleInputWithSuggestions = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        setFocusedField(e.target.name);
        const {name, value} = e.target;
        if (!value.trim()) {
            setFiltered(prev => ({...prev, [name]: []}));
            return;
        }

        const key = name.toLowerCase();
        const list =
            key.includes('kategori') ? options.kategorier :
                key.includes('lokation') ? options.lokationer :
                    key.includes('enhed') ? options.enheder : [];

        const suggestions = list
            .filter(opt => opt.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 3);

        setFiltered(prev => ({...prev, [name]: suggestions}));
        setActiveIndex(prev => ({...prev, [name]: -1}));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, name: string) => {
        const currentList = filtered[name] || [];
        const index = activeIndex[name] ?? -1;

        if (currentList.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (index + 1) % currentList.length;
            setActiveIndex(prev => ({...prev, [name]: nextIndex}));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const nextIndex = (index - 1 + currentList.length) % currentList.length;
            setActiveIndex(prev => ({...prev, [name]: nextIndex}));
        } else if (e.key === 'Enter') {
            if (currentList.length === 0) return;
            e.preventDefault();
            const selectedIndex = index >= 0 ? index : 0;
            const value = currentList[selectedIndex];
            handleChange({target: {name, value}} as React.ChangeEvent<HTMLInputElement>);
            setFiltered(prev => ({...prev, [name]: []}));
            setFocusedField(null);
        }
    };

    const handleSubmit = async () => {
        if (!item) return;

        try {
            setLoading(true);
            setErrors(null);

            const response = await fetch(`http://localhost:5212/api/beholdning/${item.Id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    navn: formData.navn,
                    beskrivelse: formData.beskrivelse,
                    mængde: formData.maengde,
                    minimum: formData.minimum,
                    kategori: formData.kategori,
                    lokation: formData.lokation,
                    enhed: formData.enhed
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update item');
            }

            onItemUpdated(); // Refresh data
            onClose(); // Close popup
        } catch (err) {
            setErrors(`Error updating item: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    // Define fields in the same order as in PopupDB
    const fields = [
        {name: 'navn', label: 'Navn', type: 'text'},
        {name: 'maengde', label: 'Mængde', type: 'number'},
        {name: 'kategori', label: 'Kategori', type: 'text'},
        {name: 'lokation', label: 'Lokation', type: 'text'},
        {name: 'enhed', label: 'Enhed', type: 'text'},
        {name: 'minimum', label: 'Minimums Beholdning', type: 'number'},
    ];

    return (
        <>
            {isOpen && <div className="popup-overlay" onClick={onClose}></div>}
            <div className={`popup ${isOpen ? 'open' : ''}`}>
                <div className="popup-header">
                    <h3>Rediger vare</h3>
                    <button
                        onClick={onClose}
                        className="close-button"
                        aria-label="Luk">
                        &times;
                    </button>
                </div>

                <div className="container">
                    {fields.map(({name, label, type}) => (
                        <div className="row-holder" key={name}>
                            <div className="p-holder">
                                <p>{label}</p>
                                {errors[name] && <span className="error">{errors[name]}</span>}
                            </div>
                            <div className="suggestion-container">
                                <input
                                    className="input-box"
                                    type={type}
                                    name={name}
                                    placeholder={label}
                                    value={formData[name as keyof typeof formData]}
                                    onChange={handleInputWithSuggestions}
                                    onFocus={() => setFocusedField(name)}
                                    onBlur={() => setTimeout(() => setFocusedField(null), 100)}
                                    onKeyDown={(e) => handleKeyDown(e, name)}
                                    autoComplete="off"
                                />
                                {focusedField === name && formData[name as keyof typeof formData].toString().trim() && filtered[name]?.length > 0 && (
                                    <ul className="autocomplete-list">
                                        {filtered[name].map((item, index) => (
                                            <li
                                                key={index}
                                                className={`autocomplete-item ${activeIndex[name] === index ? 'active' : ''}`}
                                                onMouseDown={() => handleChange({
                                                    target: {name, value: item}
                                                } as React.ChangeEvent<HTMLInputElement>)}
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="row-holder">
                        <div className="p-holder">
                            <p>Beskrivelse</p>
                            {errors.beskrivelse && <span className="error">{errors.beskrivelse}</span>}
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="textarea-box"
                            name="beskrivelse"
                            placeholder="Beskrivelse"
                            value={formData.beskrivelse}
                            onInput={handleTextareaInput}
                            rows={1}
                        />
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginRight: '10px'}}>
                    <Button label={loading ? "Gemmer..." : "Gem ændringer"} variant="primary" onClick={handleSubmit}/>
                </div>
            </div>
        </>
    );
}

export default EditPopup;