import React, { useState, useEffect } from 'react';
import { Button, Stack, Typography, IconButton } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';


interface Class {
    id: string;
    name: string;
    description?: string;
    instructor: string;
    startTime: string;
    endTime: string;
    maxUsers: number;
    schedule: string;
    gymId?: string;
}

interface Gym {
    id: string;
    name: string;
}

const ClassScreens = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [gyms, setGyms] = useState<Gym[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [classesRes, gymsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/classes`),
                    axios.get(`${API_URL}/api/gyms`)
                ]);
                setClasses(classesRes.data);
                setGyms(gymsRes.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error al cargar las clases o gimnasios');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getGymName = (gymId?: string) => {
    if (!gymId) return 'N/o';
    const gym = gyms.find(g => String(g.id) === String(gymId));
    return gym ? gym.name : 'N/A';
};


    const handleDeleteClass = async (classId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta clase?')) {
            try {
                await axios.delete(`${API_URL}/api/classes/${classId}`);
                setClasses(classes.filter(cls => cls.id !== classId));
                alert('Clase eliminada correctamente');
            } catch (error) {
                console.error('Error deleting class:', error);
                alert('Error al eliminar la clase');
            }
        }
    };

    const handleEditClass = (classId: string) => {
        navigate(`/edit-class/${classId}`);
    };

    const handleAddClass = () => {
        navigate('/sign-class');
    };

    if (loading) {
        return (
            <Stack direction="column" justifyContent="center" alignItems="center" sx={{ padding: 2, height: '50vh' }}>
                <Typography variant="h6">Cargando clases...</Typography>
            </Stack>
        );
    }

    return (
        <Stack direction="column" justifyContent="flex-start" alignItems="center" sx={{ padding: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '90%', mb: 2 }}>
                <Typography variant="h4" sx={{ color: '#fff' }}>
                    Clases
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddClass}
                    sx={{
                        backgroundColor: '#FF4C4C',
                        '&:hover': {
                            backgroundColor: '#e03b3b',
                        },
                    }}
                >
                    Nueva Clase
                </Button>
            </Stack>



            {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1, mb: 1 }}>
                    {error}
                </Typography>
            )}

            <TableContainer
                component={Paper}
                sx={{
                    marginTop: 2,
                    maxWidth: '95%',
                    maxHeight: '60vh',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    backgroundColor: '#f5f5f5',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: '10px',
                        '&:hover': {
                            backgroundColor: '#555',
                        },
                    },
                }}
            >
                <Table sx={{ minWidth: 700 }} aria-label="classes table" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Horario</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Capacidad</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Gimnasio</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Descripción</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#e0e0e0' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 3 }}>
                                    No hay clases disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            classes.map((classItem) => (
                                <TableRow key={classItem.id} hover>
                                    <TableCell>{classItem.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                        {classItem.name}
                                    </TableCell>
                                    <TableCell>  {new Date(classItem.startTime).toLocaleDateString('es-ES', { weekday: 'long' })},{" "}
                                        {new Date(classItem.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                                        {new Date(classItem.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                backgroundColor: classItem.maxUsers > 20 ? '#4caf50' :
                                                    classItem.maxUsers > 10 ? '#ff9800' : '#f44336',
                                                color: 'white'
                                            }}
                                        >
                                            {classItem.maxUsers}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {getGymName(classItem.gymId)}
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {classItem.description || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton
                                            onClick={() => handleEditClass(classItem.id)}
                                            sx={{ color: '#1976d2', mr: 1 }}
                                            title="Editar clase"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteClass(classItem.id)}
                                            sx={{ color: '#d32f2f' }}
                                            title="Eliminar clase"
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};

export default ClassScreens;