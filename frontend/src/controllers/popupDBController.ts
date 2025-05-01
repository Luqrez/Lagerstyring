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

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.navn.trim()) newErrors.navn = 'Navn er påkrævet';
    if (!formData.beskrivelse.trim()) newErrors.beskrivelse = 'Beskrivelse er påkrævet';
    if (!formData.maengde.trim()) {
      newErrors.maengde = 'Mængde er påkrævet';
    } else if (parseFloat(formData.maengde) < 0) {
      newErrors.maengde = 'Mængde kan ikke være negativ';
    }

    if (!formData.minimum.trim()) {
      newErrors.minimum = 'Minimum er påkrævet';
    } else if (parseFloat(formData.minimum) < 0) {
      newErrors.minimum = 'Minimum kan ikke være negativ';
    }
    if (!formData.kategori.trim()) newErrors.kategori = 'Kategori er påkrævet';
    if (!formData.lokation.trim()) newErrors.lokation = 'Lokation er påkrævet';
    if (!formData.enhed.trim()) newErrors.enhed = 'Enhed er påkrævet';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5212/api/beholdning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          navn: formData.navn,
          beskrivelse: formData.beskrivelse,
          maengde: parseInt(formData.maengde),
          minimum: parseInt(formData.minimum),
          kategori: formData.kategori,
          lokation: formData.lokation,
          enhed: formData.enhed,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Fejl ved oprettelse');
      }

      setIsOpen(false);
    } catch (err) {
      console.error('Fejl ved POST:', err);
      alert('Kunne ikke indsende varen. Se konsollen for detaljer.');
    }
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
