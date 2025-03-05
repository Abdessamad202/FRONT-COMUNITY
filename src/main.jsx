import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./css/index.css";
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './components/UserProvider.jsx';
import { NotificationProvider } from './components/NotificationProvider.jsx';
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <App />
            </UserProvider>
          </QueryClientProvider>
        </NotificationProvider>
    </BrowserRouter>

  </StrictMode>
)