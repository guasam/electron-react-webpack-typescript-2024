import React from 'react'
import ReactDOM from 'react-dom/client'
import icon from '@/resources/build/icon.png?asset'
import { WindowContextProvider, menuItems } from '@/app/components/window'
import { ThemeProvider } from '@/app/components/theme/ThemeProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './app'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WindowContextProvider titlebar={{ title: 'electron-react-app', icon, menuItems }}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </WindowContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
