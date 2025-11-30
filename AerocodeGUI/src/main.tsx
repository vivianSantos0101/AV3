import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' 
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from './contexts/StoreContext.tsx'
import { SessionProvider } from './contexts/SessionContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
)