import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { getUsers, updateUserRole } from '../services/firebase';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Avatar,
  CircularProgress,
  Select,
  MenuItem,
  Button
} from '@mui/material';

const AllUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users...");
                const fetchedUsers = await getUsers();
                console.log("Fetched users:", fetchedUsers);
                setUsers(fetchedUsers);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users. Please try again later.");
                setLoading(false);
            }
        };

        console.log("Current user:", user);
        
        if (user && user.rol === 'admin') {
            fetchUsers();
        } else {
            setError("You don't have permission to view this page.");
            setLoading(false);
        }
    }, [user]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? {...u, rol: newRole} : u));
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Failed to update user role. Please try again.");
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
                Usuarios Registrados
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Fecha de Nacimiento</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar 
                                        src={user.imageUid ? `https://firebasestorage.googleapis.com/v0/b/reactproject-9049c.appspot.com/o/${encodeURIComponent(user.imageUid)}?alt=media` : undefined} 
                                        alt={`${user.firstName} ${user.lastName}`}
                                    />
                                </TableCell>
                                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.birthDate && user.birthDate.toDate ? 
                                        user.birthDate.toDate().toLocaleDateString('es-ES') : 
                                        'No proporcionado'}
                                </TableCell>
                                <TableCell>{user.rol || 'usuario'}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.rol || 'usuario'}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="usuario">Usuario</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
};

export default AllUsersPage;