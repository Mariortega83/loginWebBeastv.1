import { useState, useEffect } from 'react';
import { Button, Stack, Typography, IconButton } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, useAuth } from '../context/AuthContext';


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
    const { authState } = useAuth();

    // Obtener el ID del usuario actual
    const getCurrentUserId = (): string | null => {
        const token = authState?.token;
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const currentUserId = getCurrentUserId();

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

        fetchUsers();    }, []);    const handleDeleteUser = async (userId: string) => {
        // Verificar que el admin no se borre a sí mismo
        const token = authState?.token;
        
        if (!token) {
            alert('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }

        
        let currentUserId: string | null = null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserId = payload.id;
        } catch (error) {
            console.error('Error decoding token:', error);
            alert('Error al verificar la identidad del usuario. Por favor, inicia sesión nuevamente.');
            return;
        }

        // Verificar si el usuario intenta borrarse a sí mismo
        if (currentUserId && userId === currentUserId) {
            alert('No puedes eliminar tu propia cuenta de administrador. Solicita a otro administrador que realice esta acción.');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                // Realizar la petición DELETE con el token JWT del admin
                await axios.delete(`${API_URL}/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Actualizar los usuarios después de la eliminación
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

                alert('Usuario eliminado correctamente');
            } catch (error) {
                console.error('Error deleting user:', error);

                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;
                    const message = error.response?.data?.message || '';

                    switch (status) {
                        case 400:
                            alert(`Error: ${message || 'Solicitud inválida'}`);
                            break;
                        case 401:
                            alert('Token de autenticación inválido o expirado. Por favor, inicia sesión nuevamente.');
                            break;
                        case 403:
                            alert('No tienes permisos de administrador para eliminar este usuario');
                            break;
                        case 404:
                            alert('Usuario no encontrado');
                            break;
                        case 409:
                            alert('No se puede eliminar el usuario debido a dependencias existentes');
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
                        ) : (                            users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>
                                        {user.name}
                                        {user.id === currentUserId && (
                                            <span style={{
                                                marginLeft: '8px',
                                                padding: '2px 6px',
                                                backgroundColor: '#2196f3',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                borderRadius: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                TÚ
                                            </span>
                                        )}
                                    </TableCell>
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
                                            disabled={user.id === currentUserId}
                                            sx={{ 
                                                color: user.id === currentUserId ? '#bbb' : '#d32f2f',
                                                cursor: user.id === currentUserId ? 'not-allowed' : 'pointer'
                                            }}
                                            title={user.id === currentUserId ? 
                                                "No puedes eliminar tu propia cuenta" : 
                                                "Eliminar usuario"
                                            }
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