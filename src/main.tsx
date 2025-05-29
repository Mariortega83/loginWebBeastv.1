import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from '../src/components/Login/Login'
import Home from '../src/screens/Home'
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import '../src/assets/css/index.css'

const AppContent = () => {
  const { authState } = useAuth();

  return (
    <div>
      {authState?.authenticated ? <Home /> : <Login />}
    </div>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
