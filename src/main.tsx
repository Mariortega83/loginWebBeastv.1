import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from '../src/components/Login/Login'
import Home from '../src/screens/Home'
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import '../src/assets/css/index.css'

const App = () => {
  const { authState } = useAuth();

  return (
    <div>
      {authState?.authenticated ? <Home /> : <Login />}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
