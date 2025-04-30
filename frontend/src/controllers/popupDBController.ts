// popupDBController.ts
import { useEffect, useRef, useState } from 'react';

export interface PopupDBForm {
  navn: string;
  beskrivelse: string;
  maengde: string;
  kategori: string;
  lokation: string;
  enhed: string;
  minimum: string;
}

export function usePopupDBController(isOpen: boolean, setIsOpen: (open: boolean) => void) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<PopupDBForm>({
    navn: '',
    beskrivelse: '',
    maengde: '',
    kategori: '',
    lokation: '',
    enhed: '',
    minimum: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        navn: '',
        beskrivelse: '',
        maengde: '',
        kategori: '',
        lokation: '',
        enhed: '',
        minimum: '',
      });
      setErrors({});
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.navn.trim()) newErrors.navn = 'Navn er påkrævet';
    if (!formData.beskrivelse.trim()) newErrors.beskrivelse = 'Beskrivelse er påkrævet';
    if (!formData.maengde.trim()) newErrors.maengde = 'Mængde er påkrævet';
    if (!formData.kategori.trim()) newErrors.kategori = 'Kategori er påkrævet';
    if (!formData.lokation.trim()) newErrors.lokation = 'Lokation er påkrævet';
    if (!formData.enhed.trim()) newErrors.enhed = 'Enhed er påkrævet';
    if (!formData.minimum.trim()) newErrors.minimum = 'Minimum er påkrævet';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsOpen(false);
  };

  return {
    formData,
    errors,
    textareaRef,
    handleChange,
    handleTextareaInput,
    handleSubmit,
  };
}
