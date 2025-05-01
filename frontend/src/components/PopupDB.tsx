import { usePopupDBController, PopupDBForm } from '@/controllers/popupDBController';
import '../styles/Popup.css';
import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';

interface PopupDBProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function PopupDB({ isOpen, setIsOpen }: PopupDBProps) {
  const {
    formData,
    errors,
    textareaRef,
    handleChange,
    handleTextareaInput,
    handleSubmit,
  } = usePopupDBController(isOpen, setIsOpen);

  const [options, setOptions] = useState<{ enheder: string[]; lokationer: string[]; kategorier: string[] }>(
    { enheder: [], lokationer: [], kategorier: [] }
  );
  const [filtered, setFiltered] = useState<{ [key: string]: string[] }>({});
  const [activeIndex, setActiveIndex] = useState<{ [key: string]: number }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5212/api/options')
      .then(res => res.json())
      .then(data => setOptions({
        enheder: data.Enheder,
        lokationer: data.Lokationer,
        kategorier: data.Kategorier
      }));
  }, []);

  const handleInputWithSuggestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setFocusedField(e.target.name); // <-- force re-showing
    const { name, value } = e.target;
    if (!value.trim()) {
      setFiltered(prev => ({ ...prev, [name]: [] }));
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

    setFiltered(prev => ({ ...prev, [name]: suggestions }));
    setActiveIndex(prev => ({ ...prev, [name]: -1 }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, name: keyof PopupDBForm) => {
    const currentList = filtered[name] || [];
    const index = activeIndex[name] ?? -1;

    if (currentList.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % currentList.length;
      setActiveIndex(prev => ({ ...prev, [name]: nextIndex }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = (index - 1 + currentList.length) % currentList.length;
      setActiveIndex(prev => ({ ...prev, [name]: nextIndex }));
    } else if (e.key === 'Enter') {
      if (currentList.length === 0) return;
      e.preventDefault();
      const selectedIndex = index >= 0 ? index : 0;
      const value = currentList[selectedIndex];
      handleChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
      setFiltered(prev => ({ ...prev, [name]: [] }));
      setFocusedField(null);
    }
  };

  const fields: { name: keyof PopupDBForm; label: string; type: string }[] = [
    { name: 'navn', label: 'Navn', type: 'text' },
    { name: 'maengde', label: 'Mængde', type: 'number' },
    { name: 'kategori', label: 'Kategori', type: 'text' },
    { name: 'lokation', label: 'Lokation', type: 'text' },
    { name: 'enhed', label: 'Enhed', type: 'text' },
    { name: 'minimum', label: 'Minimums Beholdning', type: 'number' },
  ];

  return (
    <>
      {isOpen && <div className="popup-overlay" onClick={() => setIsOpen(false)} />}

      <div className={`popup ${isOpen ? 'open' : ''}`}>
        <div className="popup-header">
          <h3>Tilføj ny vare til lager</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="close-button"
            aria-label="Luk">
            &times;
          </button>
        </div>

        <div className="container">
          {fields.map(({ name, label, type }) => (
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
                  value={formData[name]}
                  onChange={handleInputWithSuggestions}
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setTimeout(() => setFocusedField(null), 100)}
                  onKeyDown={(e) => handleKeyDown(e, name)}
                  autoComplete="off"
                />
                {focusedField === name && formData[name].trim() && filtered[name]?.length > 0 && (
                  <ul className="autocomplete-list">
                    {filtered[name].map((item, index) => (
                      <li
                        key={index}
                        className={`autocomplete-item ${activeIndex[name] === index ? 'active' : ''}`}
                        onMouseDown={() => handleChange({
                          target: { name, value: item }
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginRight: '10px' }}>
          <Button label="Submit" variant="primary" onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
}

export default PopupDB;