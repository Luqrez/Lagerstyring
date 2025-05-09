import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// chat this is used to easily route to pages based on endpoint ('/Login', '/Dashboard')
import { BrowserRouter } from 'react-router-dom';

console.log('main.tsx: Starting to render the app');

const rootElement = document.getElementById('root');
console.log('main.tsx: Root element:', rootElement);

createRoot(rootElement!).render(
  // To highlight potential problems during development good for debugging
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
