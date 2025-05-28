import React, { useState, useEffect } from 'react';
import { Button, Stack, Typography, IconButton } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import InputBar from '../components/InputBar';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    gymId?: string;
}

const UserScreens = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Cargar usuarios al montar el componente
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/users`);
                setUsers(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error al cargar los usuarios');
                
                
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await axios.delete(`${API_URL}/api/users/${userId}`);
                setUsers(users.filter(user => user.id !== userId));
                alert('Usuario eliminado correctamente');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error al eliminar el usuario');
            }
        }
    };

    const handleEditUser = (userId: string) => {
        navigate(`/edit-user/${userId}`);
    };

    const handleAddUser = () => {
        navigate('/sign-users');
    };

    if (loading) {
        return (
            <Stack direction="column" justifyContent="center" alignItems="center" sx={{ padding: 2, height: '50vh' }}>
                <Typography variant="h6">Cargando usuarios...</Typography>
            </Stack>
        );
    }

    return (
        <Stack direction="column" justifyContent="flex-start" alignItems="center" sx={{ padding: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '80%', mb: 2 }}>
                <Typography variant="h4" sx={{ color: '#fff' }}>
                    Usuarios
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddUser}
                    sx={{
                        backgroundColor: '#FF4C4C',
                        '&:hover': {
                            backgroundColor: '#e03b3b',
                        },
                    }}
                >
                    Nuevo Usuario
                </Button>
            </Stack>

            <InputBar />

            {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1, mb: 1 }}>
                    {error}
                </Typography>
            )}

            <TableContainer 
                component={Paper} 
                sx={{ 
                    marginTop: 2, 
                    maxWidth: '90%', 
                    maxHeight: '60vh', // Altura máxima para activar scroll
                    marginLeft: 'auto', 
                    marginRight: 'auto',
                    backgroundColor: '#f5f5f5',
                    overflowY: 'auto', // Scroll vertical
                    overflowX: 'auto', // Scroll horizontal si es necesario
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
                <Table sx={{ minWidth: 650 }} aria-label="users table" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Teléfono</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Rol</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#e0e0e0' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                                    No hay usuarios disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone || 'N/A'}</TableCell>
                                    <TableCell>
                                        <span 
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                backgroundColor: user.role === 'ADMIN' ? '#ff9800' : 
                                                               user.role === 'TRAINER' ? '#4caf50' : '#2196f3',
                                                color: 'white'
                                            }}
                                        >
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton
                                            onClick={() => handleEditUser(user.id)}
                                            sx={{ color: '#1976d2', mr: 1 }}
                                            title="Editar usuario"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteUser(user.id)}
                                            sx={{ color: '#d32f2f' }}
                                            title="Eliminar usuario"
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

export default UserScreens;