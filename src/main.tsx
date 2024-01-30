import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppProvider } from './contexts/app.context.tsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import '~/i18n/i18n.ts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})
// Bao boc bang ErrorBoundary de bat loi neu co, co thi tra ve UI du phong (fallback UI)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
