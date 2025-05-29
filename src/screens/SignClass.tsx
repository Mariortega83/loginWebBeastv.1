import React, { useState, useEffect } from 'react';
import { Button, Stack, Typography, TextField, Container, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

interface Gym {
    id: string;
    name: string;
    address?: string;
}

const SignClass = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [maxUsers, setMaxUsers] = useState('');
    const [gymId, setGymId] = useState('');
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
            }
        };
        fetchGyms();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // Validaciones básicas
        if (!gymId) {
            alert('Por favor, selecciona un gimnasio');
            return;
        }
        
        if (parseInt(maxUsers) <= 0) {
            alert('La capacidad máxima debe ser mayor a 0 personas');
            return;
        }

        // Validar que endTime sea después de startTime
        if (new Date(endTime) <= new Date(startTime)) {
            alert('La hora de finalización debe ser posterior a la hora de inicio');
            return;
        }

        try {
            const result = await axios.post(`${API_URL}/api/classes`, {
                name,
                description,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                maxUsers: parseInt(maxUsers),
                gymId
            });
            
            console.log('Class created successfully:', result);
            alert('Clase creada exitosamente');
            
            // Limpiar formulario
            setName('');
            setDescription('');
            setStartTime('');
            setEndTime('');
            setMaxUsers('');
            setGymId('');

            navigate('/classes');
        } catch (error) {
            console.error('Error creating class:', error);
            
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message || '';
                
                switch (status) {
                    case 400:
                        alert(`Datos inválidos: ${message}`);
                        break;
                    case 409:
                        alert(`Conflicto: ${message}`);
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
        }
    };

    return (
        <Container maxWidth="sm" sx={{ padding: 4 }}>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
                <Typography variant="h4" component="h1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Crear Nueva Clase
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Nombre de la Clase"
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
                            label="Descripción"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                            label="Hora de Inicio"
                            variant="outlined"
                            type="datetime-local"
                            fullWidth
                            required
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
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
                                shrink: true,
                            }}
                        />

                        <TextField
                            label="Hora de Finalización"
                            variant="outlined"
                            type="datetime-local"
                            fullWidth
                            required
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
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
                                shrink: true,
                            }}
                        />

                        <TextField
                            label="Capacidad Máxima (personas)"
                            variant="outlined"
                            type="number"
                            fullWidth
                            required
                            value={maxUsers}
                            onChange={(e) => setMaxUsers(e.target.value)}
                            InputProps={{
                                style: {
                                    backgroundColor: '#1e1e1e',
                                    color: '#fff',
                                    borderRadius: 12,
                                    padding: '10px 15px',
                                },
                                inputProps: { min: 1, max: 100 }
                            }}
                            InputLabelProps={{
                                style: { color: '#f1f1f1' },
                            }}
                        />

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
                                    <MenuItem key={gym.id} value={gym.id}>
                                        <div>
                                            <div>{gym.name}</div>
                                            {gym.address && (
                                                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                    {gym.address}
                                                </div>
                                            )}
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
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
                            Crear Clase
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/classes')}
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
                            Cancelar
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
};

export default SignClass;