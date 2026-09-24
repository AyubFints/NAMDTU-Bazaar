import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './ErrorBoundary';
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <ErrorBoundary><App /></ErrorBoundary>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
