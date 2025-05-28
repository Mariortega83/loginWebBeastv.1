import React, { useState, useEffect } from 'react';
import { Button, Stack, Typography, TextField, Container, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

interface Gym {
    id: number;
    name: string;
}

const SignUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gymId, setGymId] = useState('');
    const [role, setRole] = useState('USER');
    const [gyms, setGyms] = useState<Gym[]>([]);
    const navigate = useNavigate();

    // Cargar la lista de gimnasios al montar el componente
    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/gyms`);
                setGyms(response.data);
            } catch (error) {
                console.error('Error fetching gyms:', error);
                // Datos de ejemplo en caso de error
                setGyms([
                    { id: 1, name: 'Beast Mode Gym - Centro' },
                    { id: 2, name: 'Beast Mode Gym - Norte' },
                    { id: 3, name: 'Beast Mode Gym - Sur' }
                ]);
            }
        };
        fetchGyms();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const result = await axios.post(`${API_URL}/api/auth/register`, {
                name,
                email,
                password,
                phone,
                gymId,
                role
            });
            console.log('User created successfully:', result);
            alert('Usuario creado exitosamente');
            setName('');
            setEmail('');
            setPassword('');
            setPhone('');
            setGymId('');
            setRole('USER');

            navigate('/users');
        } catch (error) {
            console.error('Error creating user:', error);

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
                case 500:
                    alert('Error del servidor. Inténtalo más tarde.');
                    break;
                default:
                    alert(`Error ${status}: ${message || 'Error desconocido'}`);
            }
        } else {
            alert('Error de conexión. Verifica tu conexión a internet.');
        }
            return;
        }
    };

    return (
        <Container maxWidth="xs" sx={{ padding: 4 }}>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
                <Typography variant="h4" component="h1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Create New User
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Full Name"
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
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            label="Phone"
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
                                    <MenuItem key={gym.id} value={gym.id.toString()}>
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
                            color="secondary"
                            fullWidth
                            sx={{
                                borderRadius: 12,
                                padding: '14px',
                                fontWeight: 'bold',
                                backgroundColor: '#FF4C4C',
                                '&:hover': {
                                    backgroundColor: '#e03b3b',
                                },
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            Create User
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/users')}
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
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                            }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
};

export default SignUser;