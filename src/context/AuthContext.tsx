import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface AuthProps {
    authState?: { token: string | null, authenticated: boolean | null, isAdmin: boolean | null };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'userToken';

export const API_URL = 'http://172.20.10.2:3000'

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

// Función para decodificar JWT y extraer el rol
const decodeToken = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null,
        authenticated: boolean | null,
        isAdmin: boolean | null
    }>({
        token: null,
        authenticated: null,
        isAdmin: null
    });    useEffect(() => {
        const token = Cookies.get(TOKEN_KEY);
        console.log('Loaded token:', token);
        
        if (token) {
            const decodedToken = decodeToken(token);
            const isAdmin = decodedToken?.role !== 'USER';
            
            // Guardar gymId en localStorage si existe en el token
            if (decodedToken?.gymId) {
                localStorage.setItem('gymId', decodedToken.gymId);
                console.log('gymId guardado en localStorage al cargar:', decodedToken.gymId);
            }
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setAuthState({ token, authenticated: true, isAdmin });
            console.log('User authenticated with token: true, isAdmin:', isAdmin);
        } else {
            // Limpiar gymId del localStorage si no hay token
            localStorage.removeItem('gymId');
            axios.defaults.headers.common['Authorization'] = '';
            setAuthState({ token: null, authenticated: false, isAdmin: null });
            console.log('User authenticated with token: false');
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            console.log('Login result:', result);            if (result && result.data && result.data.token) {
                const { token } = result.data;
                
                // Decodificar el token para obtener el rol
                const decodedToken = decodeToken(token);
                const isAdmin = decodedToken?.role !== 'USER';

                // Verificar si el usuario es admin antes de permitir el login
                if (!isAdmin) {
                    alert('No eres admin, no tienes acceso')
                    console.log('Access denied: User is not admin');
                    await Cookies.remove(TOKEN_KEY);
                    setAuthState({ token: null, authenticated: false, isAdmin: null });
                    axios.defaults.headers.common['Authorization'] = '';
                    return { error: true, msg: 'Access denied: Admin privileges required', data: null };
                    
                } else {

                    Cookies.set(TOKEN_KEY, token, { expires: 1 / 1440 });
                    setAuthState({ token, authenticated: true, isAdmin });
                    console.log('Autenticado - Role:', decodedToken?.role, 'isAdmin:', isAdmin);

                    // Guardar gymId en localStorage si existe en el token
                    if (decodedToken?.gymId) {
                        localStorage.setItem('gymId', decodedToken.gymId);
                        console.log('gymId guardado en localStorage:', decodedToken.gymId);
                    }

                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    return { error: false, msg: 'Login successful', data: result.data };
                }
            } else {
                console.log('Login failed: No token returned');
                return { error: true, msg: 'Login failed: No token returned', data: null };
            }
        } catch (error) {
            console.error('Login failed:', error);
            let errorMsg = 'Login failed';
            if (error && typeof error === 'object' && 'message' in error) {
                errorMsg = (error as { message?: string }).message || errorMsg;
            }
            return { error: true, msg: errorMsg, data: null };        }
    };

    const logout = async () => {
        await Cookies.remove(TOKEN_KEY);
        localStorage.removeItem('gymId'); // Limpiar gymId del localStorage
        setAuthState({ token: null, authenticated: false, isAdmin: null });
        axios.defaults.headers.common['Authorization'] = '';
    };

    const value = {
        authState,
        onLogin: login,
        onLogout: logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};