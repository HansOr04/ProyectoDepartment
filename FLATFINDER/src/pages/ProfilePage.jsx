import React from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Avatar, 
  Grid,
  Box
} from '@mui/material';
import { Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';

// Función auxiliar para formatear la fecha
const formatDate = (timestamp) => {
  if (!timestamp) return 'No proporcionado';
  
  let date;
  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp.seconds) {
    // Si es un objeto con seconds, asumimos que es un timestamp de Firestore
    date = new Date(timestamp.seconds * 1000);
  } else {
    return 'Fecha inválida';
  }

  // Formatea la fecha en español
  return date.toLocaleDateString('es-ES', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

// Función para construir la URL del avatar
const getAvatarUrl = (imageUid) => {
  if (!imageUid) return null;
  return `https://firebasestorage.googleapis.com/v0/b/reactproject-9049c.appspot.com/o/${encodeURIComponent(imageUid)}?alt=media`;
};

export default function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
          <Container maxWidth="sm">
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>Cargando datos del usuario...</Typography>
          </Container>
        );
    }

    const handleUpdateProfile = () => {
        navigate('/update-profile');
    };

    const avatarUrl = getAvatarUrl(user.imageUid);

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
                Tu Perfil
            </Typography>
            <Card raised>
                <CardContent>
                    <Box display="flex" justifyContent="center" mb={3}>
                        <Avatar
                            src={avatarUrl}
                            alt={`${user.firstName} ${user.lastName}`}
                            sx={{ width: 200, height: 200 }}
                        >
                            {!avatarUrl && <PersonIcon sx={{ fontSize: 80 }} />}
                        </Avatar>
                    </Box>
                    <Typography variant="h5" component="div" gutterBottom align="center">
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Correo Electrónico
                            </Typography>
                            <Typography variant="body1">
                                {user.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Fecha de Nacimiento
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(user.birthDate)}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<EditIcon />}
                        onClick={handleUpdateProfile}
                        fullWidth
                    >
                        Actualizar Perfil
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
}
