import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { BrowserRouter as Router } from 'react-router-dom'

import { HelmetProvider } from 'react-helmet-async'
import { ToastProvider } from './context/ToastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <ToastProvider>
          <Router>
            <App />
          </Router>
        </ToastProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)

