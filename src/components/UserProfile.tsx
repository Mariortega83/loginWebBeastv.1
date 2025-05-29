import React, { useState, useEffect } from "react";
import { Stack, Typography, IconButton, CircularProgress } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth, API_URL } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface JwtPayload {
    id?: string;
    email?: string;
    role?: string;
    gymId?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
}

const UserProfile = () => {
    const { authState } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const token = authState?.token;
                
                if (token) {
                    const payload = jwtDecode<JwtPayload>(token);
                    const userId = payload.id;
                    console.log('Decoded token payload:', payload);
                    
                    if (userId) {
                        const response = await axios.get(`${API_URL}/api/users/${userId}`);
                        setUser(response.data);
                        setError(null);
                        console.log('User data fetched successfully:', response.data);
                    } else {
                        // Si no hay userId en el token, usar los datos del token
                        setUser({
                            id: 'unknown',
                            name: 'Usuario',
                            email: payload.email || 'No disponible',
                            role: payload.role || 'USER'
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error al cargar datos del usuario');
                
                // Fallback: usar datos del token si la API falla
                if (authState?.token) {
                    try {
                        const payload = jwtDecode<JwtPayload>(authState.token);
                        setUser({
                            id: 'unknown',
                            name: 'Usuario',
                            email: payload.email || 'No disponible',
                            role: payload.role || 'USER'
                        });
                    } catch (tokenError) {
                        console.error('Error decoding token:', tokenError);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        if (authState?.authenticated) {
            fetchUserData();
        }
    }, [authState]);

    if (loading) {
        return (
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ padding: 2 }}
            >
                <CircularProgress size={24} sx={{ color: 'white' }} />
            </Stack>
        );
    }

    if (error && !user) {
        return (
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ padding: 1 }}
            >
                <Typography variant="caption" sx={{ color: '#ff6b6b' }}>
                    Error al cargar perfil
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            gap={2}
            alignItems="center"
            width="auto"
            overflow="hidden"
        >
            <img
                src="/vite.svg"
                alt="Profile"
                loading="lazy"
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                }}
            />
            <Stack 
                direction="column" 
                justifyContent="center" 
                alignItems="flex-start"
                sx={{ flex: 1, minWidth: 0 }} // minWidth: 0 permite que el texto se trunque
            >
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '150px'
                    }}
                >
                    {user?.name || 'Usuario'}
                </Typography>
                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        color: '#bdc3c7',
                        fontSize: '0.7rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '150px'
                    }}
                >
                    {user?.email || 'Email no disponible'}
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: user?.role === 'ADMIN' ? '#f39c12' : 
                               user?.role === 'TRAINER' ? '#27ae60' : '#3498db',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}
                >
                    {user?.role || 'USER'}
                </Typography>
            </Stack>

            <IconButton sx={{ padding: 0 }}>
                <AccountCircleIcon fontSize="medium" sx={{ color: "white" }} />
            </IconButton>
        </Stack>
    );
};

export default UserProfile;