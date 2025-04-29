import '../styles/Popup.css';
 
interface PopupDBProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}
 
function PopupDB({ isOpen, setIsOpen }: PopupDBProps) {
  return (
    <>
      <div className={`popup ${isOpen ? 'open' : ''}`}>
        <h2>Popup Title</h2>
        <p>This is a sliding popup!</p>
        <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
    </>
  );
}
 
export default PopupDB;
 