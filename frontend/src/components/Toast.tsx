import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import { createPortal } from 'react-dom';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast interface
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Toast context interface
interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast container animation
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Styled components
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

interface ToastItemProps {
  type: ToastType;
  exiting: boolean;
}

const ToastItem = styled.div<ToastItemProps>`
  min-width: 300px;
  padding: 15px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${props => props.exiting ? slideOut : slideIn} 0.3s ease-in-out forwards;

  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FF9800';
      case 'info':
      default:
        return '#3F72AF';
    }
  }};

  color: white;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

// Toast provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('Toast.tsx: Rendering ToastProvider component');

  const [toasts, setToasts] = useState<(Toast & { exiting?: boolean })[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    // Mark the toast as exiting to trigger the exit animation
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, exiting: true } : toast
      )
    );

    // Remove the toast after the animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  // Create portal for toast container
  console.log('Toast.tsx: Creating portal for toast container');
  console.log('Toast.tsx: document:', typeof document !== 'undefined' ? 'defined' : 'undefined');
  console.log('Toast.tsx: document.body:', typeof document !== 'undefined' ? (document.body ? 'defined' : 'undefined') : 'undefined');

  const toastPortal = typeof document !== 'undefined' ? 
    createPortal(
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem key={toast.id} type={toast.type} exiting={toast.exiting || false}>
            <span>{toast.message}</span>
            <CloseButton onClick={() => removeToast(toast.id)}>&times;</CloseButton>
          </ToastItem>
        ))}
      </ToastContainer>,
      document.body
    ) : null;

  console.log('Toast.tsx: Rendering ToastContext.Provider');

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastPortal}
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  console.log('Toast.tsx: Using useToast hook');

  const context = useContext(ToastContext);
  console.log('Toast.tsx: useToast context:', context);

  if (context === undefined) {
    console.error('Toast.tsx: useToast context is undefined');
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
