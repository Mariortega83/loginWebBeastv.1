import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Stack, Typography, Container, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

interface Gym {
    id: string;
    name: string;
}

interface Class {
    id: string;
    name: string;
    description?: string;
    startTime: string;
    endTime: string;
    maxUsers: number;
    gymId?: string;
}

const EditClassScreen = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<Class | null>(null);
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const classRes = await axios.get(`${API_URL}/api/classes/${classId}`);
                setClassData(classRes.data);
                const gymsRes = await axios.get(`${API_URL}/api/gyms`);
                setGyms(gymsRes.data);
                setError(null);
            } catch (err) {
                setError('Error al cargar la clase o los gimnasios');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [classId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        if (!classData) return;
        const { name, value } = e.target;
        setClassData({
            ...classData,
            [name as string]: value,
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        if (!classData) return;
        const { name, value } = e.target;
        setClassData({
            ...classData,
            [name as string]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!classData?.gymId) {
            alert('Por favor, selecciona un gimnasio');
            return;
        }
        try {
            setSaving(true);
            // Formatea los campos correctamente
            const payload = {
                ...classData,
                maxUsers: Number(classData.maxUsers),
                startTime: new Date(classData.startTime).toISOString(),
                endTime: new Date(classData.endTime).toISOString(),
            };
            await axios.put(`${API_URL}/api/classes/${classId}`, payload);
            alert('Clase actualizada correctamente');
            navigate('/classes');
        } catch (err) {
            setError('Error al actualizar la clase');
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
                        Cargando datos de la clase...
                    </Typography>
                </Stack>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xs" sx={{ padding: 4 }}>
                <Stack direction="column" justifyContent="center" alignItems="center" spacing={4} sx={{ minHeight: '50vh' }}>
                    <Typography color="error">{error}</Typography>
                </Stack>
            </Container>
        );
    }

    if (!classData) return null;

    return (
        <Container maxWidth="xs" sx={{ padding: 4 }}>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
                <Typography variant="h4" component="h1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Editar Clase
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Nombre de la Clase"
                            name="name"
                            variant="outlined"
                            fullWidth
                            required
                            value={classData.name}
                            onChange={handleChange}
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
                            name="description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={classData.description || ''}
                            onChange={handleChange}
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
                            name="startTime"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            required
                            value={classData.startTime.slice(0, 16)}
                            onChange={handleChange}
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
                            name="endTime"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            required
                            value={classData.endTime.slice(0, 16)}
                            onChange={handleChange}
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
                            name="maxUsers"
                            type="number"
                            variant="outlined"
                            fullWidth
                            required
                            value={classData.maxUsers}
                            onChange={handleChange}
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
                                name="gymId"
                                value={classData.gymId || ''}
                                label="Gimnasio"
                                onChange={handleSelectChange}
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
                                        {gym.name}
                                    </MenuItem>
                                ))}
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
                                'Actualizar Clase'
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/classes')}
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

export default EditClassScreen;