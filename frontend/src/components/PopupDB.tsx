import { usePopupDBController, PopupDBForm } from '@/controllers/popupDBController';
import '../styles/Popup.css';
import { Button } from '@/components/Button';

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
    handleSubmit
  } = usePopupDBController(isOpen, setIsOpen);

  const fields: { name: keyof PopupDBForm; label: string; type: string }[] = [
    { name: 'navn', label: 'Navn', type: 'text' },
    { name: 'maengde', label: 'Mængde', type: 'number' },
    { name: 'kategori', label: 'Kategori', type: 'text' },
    { name: 'lokation', label: 'Lokation', type: 'text' },
    { name: 'enhed', label: 'Enhed', type: 'text' },
    { name: 'minimum', label: 'Minimums Beholdning', type: 'text' },
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
              <input
                className="input-box"
                type={type}
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
              />
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
