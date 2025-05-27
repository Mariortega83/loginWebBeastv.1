import React, { createContext, useContext, useState, useEffect } from 'react';

import Cookies from 'js-cookie';

import axios from 'axios';

interface AuthProps {
    authState?: { token: string | null, authenticated: boolean | null };
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

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{ 
        token: string | null, 
        authenticated: boolean | null 
    }>({

        token: null,
        authenticated: null
    });

    useEffect(() => {
        const token = Cookies.get(TOKEN_KEY);
        console.log('Loaded token:', token);
        
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setAuthState({ token, authenticated: true });
            console.log('User authenticated with token: true');
        } else {
            axios.defaults.headers.common['Authorization'] = '';
            setAuthState({ token: null, authenticated: false });
            console.log('User authenticated with token: false');
        }
    }, []);

    const login = async (email: string, password: string) => {
    try {
        const result = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        console.log('Login result:', result);

        if (result && result.data && result.data.token) {
            
            const { token } = result.data;

            
            Cookies.set(TOKEN_KEY, token, { expires: 1/1440 });
            setAuthState({ token, authenticated: true });
            console.log('Atutenticado');

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { error: false, msg: 'Login successful', data: result.data }; 
        } else {
            
            console.log('Atutenticado');
            return { error: true, msg: 'Login failed: No token returned', data: null };
             
        }
    } catch (error) {
        console.error('Login failed:', error);
        let errorMsg = 'Login failed';
        if (error && typeof error === 'object' && 'message' in error) {
            errorMsg = (error as { message?: string }).message || errorMsg;
        }
        return { error: true, msg: errorMsg, data: null }; // Retorna el error
    }
};

    const logout = async () => {
        await Cookies.remove(TOKEN_KEY);
        setAuthState({ token: null, authenticated: false });
        axios.defaults.headers.common['Authorization'] = '';
    };

    const value = {
        authState,
        onLogin: login,
        onLogout: logout,
    };

    return(
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>);

};

