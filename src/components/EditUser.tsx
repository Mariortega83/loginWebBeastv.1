import React, { useState, useEffect } from 'react';
import { Button, Stack, Typography, TextField, Container, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

interface Gym {
    id: string; 
    name: string;
}

interface User {
    id: string; 
    name: string;
    email: string;
    phone?: string;
    role: string;
    gymId?: string; 
}

const EditUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gymId, setGymId] = useState('');
    const [role, setRole] = useState('USER');
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                setLoading(true);

                
                const userResponse = await axios.get(`${API_URL}/api/users/${userId}`);
                const userData: User = userResponse.data;

                setName(userData.name);
                setEmail(userData.email);
                setPhone(userData.phone || '');
                setRole(userData.role);
                setGymId(userData.gymId || '');

                
                const gymsResponse = await axios.get(`${API_URL}/api/gyms`);
                setGyms(gymsResponse.data);

            } catch (error) {
                console.error('Error loading data:', error);
                alert('Error al cargar los datos del usuario');


            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!gymId) {
            alert('Por favor, selecciona un gimnasio');
            return;
        }

        try {
            setSaving(true);

            const result = await axios.put(`${API_URL}/api/users/${userId}`, {
                name,
                email,
                phone,
                gymId, 
                role
            });

            console.log('User updated successfully:', result);
            alert('Usuario actualizado exitosamente');
            navigate('/users');window.location.reload();

        } catch (error) {
            console.error('Error updating user:', error);

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message || '';

                switch (status) {
                    case 409:
                        alert(`El email ya está en uso: ${message}`);
                        break;
                    case 400:
                        alert(`Datos inválidos: ${message}`);
                        break;
                    case 404:
                        alert('Usuario no encontrado');
                        break;
                    case 500:
                        alert('Error del servidor. Inténtalo más tarde.');
                        break;
                    default:
                        alert(`Error ${status}: ${message || 'Error desconocido'}`);
                }
            } else {
                alert('Error de conexión. Verifica tu conexión a internet.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xs" sx={{ padding: 4 }}>
                <Stack direction="column" justifyContent="center" alignItems="center" spacing={4} sx={{ minHeight: '50vh' }}>
                    <CircularProgress sx={{ color: '#FF4C4C' }} />
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                        Cargando datos del usuario...
                    </Typography>
                </Stack>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" sx={{ padding: 4 }}>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
                <Typography variant="h4" component="h1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Editar Usuario
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Nombre Completo"
                            variant="outlined"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{
                                style: {
                                    backgroundColor: '#1e1e1e',
                                    color: '#fff',
                                    borderRadius: 12,
                                    padding: '10px 15px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: '#f1f1f1' },
                            }}
                        />

                        <TextField
                            label="Email"
                            variant="outlined"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                style: {
                                    backgroundColor: '#1e1e1e',
                                    color: '#fff',
                                    borderRadius: 12,
                                    padding: '10px 15px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: '#f1f1f1' },
                            }}
                        />

                        <TextField
                            label="Teléfono"
                            variant="outlined"
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            InputProps={{
                                style: {
                                    backgroundColor: '#1e1e1e',
                                    color: '#fff',
                                    borderRadius: 12,
                                    padding: '10px 15px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: '#f1f1f1' },
                            }}
                        />

                        {/* Desplegable para seleccionar gimnasio */}
                        <FormControl fullWidth required>
                            <InputLabel
                                id="gym-select-label"
                                sx={{ color: '#f1f1f1' }}
                            >
                                Gimnasio
                            </InputLabel>
                            <Select
                                labelId="gym-select-label"
                                value={gymId}
                                label="Gimnasio"
                                onChange={(e) => setGymId(e.target.value)}
                                sx={{
                                    backgroundColor: '#1e1e1e',
                                    color: '#fff',
                                    borderRadius: 3,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#555',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: '#fff',
                                    },
                                }}
                            >
                                {gyms.map((gym) => (
                                    <MenuItem key={gym.id} value={gym.id}> {/* Sin toString() */}
                                        {gym.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Desplegable para seleccionar rol */}
                        <FormControl fullWidth required>
                            <InputLabel
                                id="role-select-label"
                                sx={{ color: '#f1f1f1' }}
                            >
                                Rol
                            </InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={role}
                                label="Rol"
                                onChange={(e) => setRole(e.target.value)}
                                sx={{
                                    backgroundColor: '#1e1e1e',
                                    color: '#fff',
                                    borderRadius: 3,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#555',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: '#fff',
                                    },
                                }}
                            >
                                <MenuItem value="USER">Usuario</MenuItem>
                                <MenuItem value="ADMIN">Administrador</MenuItem>
                                <MenuItem value="TRAINER">Entrenador</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={saving}
                            sx={{
                                borderRadius: 12,
                                padding: '14px',
                                fontWeight: 'bold',
                                backgroundColor: '#FF4C4C',
                                '&:hover': {
                                    backgroundColor: '#e03b3b',
                                },
                                '&:disabled': {
                                    backgroundColor: '#666',
                                },
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            {saving ? (
                                <>
                                    <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
                                    Guardando...
                                </>
                            ) : (
                                'Actualizar Usuario'
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/users')}
                            disabled={saving}
                            sx={{
                                borderRadius: 12,
                                padding: '14px',
                                fontWeight: 'bold',
                                color: '#007BFF',
                                borderColor: '#007BFF',
                                '&:hover': {
                                    backgroundColor: '#007BFF',
                                    color: '#fff',
                                },
                                '&:disabled': {
                                    borderColor: '#666',
                                    color: '#666',
                                },
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                            }}
                        >
                            Cancelar
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
};

export default EditUser;