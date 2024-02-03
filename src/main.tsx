import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import '~/i18n/i18n.ts'
import { AppProvider } from './contexts/app.context.tsx'

// Bao boc bang ErrorBoundary de bat loi neu co, co thi tra ve UI du phong (fallback UI)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
