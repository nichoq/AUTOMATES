import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import LandingPage from './LandingPage.tsx';
import './index.css';

function Root() {
  const [launched, setLaunched] = useState(false);

  if (launched) {
    return <App onGoHome={() => setLaunched(false)} />;
  }
  return <LandingPage onLaunch={() => setLaunched(true)} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
