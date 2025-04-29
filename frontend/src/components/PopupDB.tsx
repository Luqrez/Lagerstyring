import { useRef } from 'react';
import '../styles/Popup.css';

interface PopupDBProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

function PopupDB({ isOpen, setIsOpen }: PopupDBProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // set new height
    }
  };

  return (
    <>
      {isOpen && <div className="popup-overlay" onClick={() => setIsOpen(false)} />}

      <div className={`popup ${isOpen ? 'open' : ''}`}>
        <div className="container">
          <h3>Tilføj ny vare til lager</h3>
        </div>

        <div className="container">
          <div className="row-holder">
            <p>Navn</p>
            <input className="input-box" type="text" placeholder="Navn" />
          </div>

          <div className="row-holder">
            <p>Beskrivelse</p>
            <textarea
              ref={textareaRef}
              className="textarea-box"
              placeholder="Beskrivelse"
              name="beskrivelse"
              rows={5}
              onInput={handleTextareaInput}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PopupDB;
