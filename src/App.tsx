import { useContext, useEffect } from 'react'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

function App() {
  const routeElements = useRouteElements()

  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLocalStorage', reset)

    return () => {
      LocalStorageEventTarget.removeEventListener('clearLocalStorage', reset)
    }
  }, [reset])

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          {routeElements}
          <ToastContainer />
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
