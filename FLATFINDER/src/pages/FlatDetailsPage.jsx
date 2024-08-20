import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  Grid, 
  Button, 
  Divider, 
  CircularProgress,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getFlatByID } from '../services/firebaseFlats';
import { getUserByID } from '../services/firebase';
import FlatMessages from '../components/Flats/FlatMessages';
import { useAuth } from '../contexts/authContext';

export default function FlatDetailsPage() {
    const { id } = useParams();
    const [flat, setFlat] = useState(null);
    const [flatOwner, setFlatOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        console.log("Current user in FlatDetailsPage:", user);
    }, [user]);

    useEffect(() => {
        const fetchFlatAndOwner = async () => {
            try {
                setLoading(true);
                console.log("Fetching flat with ID:", id);
                const flatData = await getFlatByID(id);
                console.log("Fetched flat data:", flatData);
                setFlat(flatData);
                if (flatData.ownerId) {
                    console.log("Fetching owner with ID:", flatData.ownerId);
                    const ownerData = await getUserByID(flatData.ownerId);
                    console.log("Fetched owner data:", ownerData);
                    setFlatOwner(ownerData);
                }
            } catch (error) {
                console.error("Error fetching flat details:", error);
                setError("Failed to load flat details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlatAndOwner();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading || authLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!flat) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography>Flat not found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ marginBottom: 2 }}
            >
                Volver
            </Button>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Card sx={{ marginBottom: 3 }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={flat.imageURL || 'https://via.placeholder.com/300x200'}
                        alt={`${flat.streetName} ${flat.streetNumber}`}
                    />
                </Card>
                <Typography variant="h4" component="h1" gutterBottom>
                    {flat.streetName}, {flat.streetNumber}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {flat.city}, {flat.country}
                </Typography>
                <Typography variant="body1" paragraph>
                    {flat.description}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body1">Año de construcción: {flat.yearBuilt}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Área: {flat.areaSize} m²</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Aire acondicionado: {flat.hasAC ? 'Sí' : 'No'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            Disponible desde: {flat.dateAvailable ? new Date(flat.dateAvailable.toDate()).toLocaleDateString() : 'No especificado'}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography variant="h5" component="p" sx={{ marginTop: 2 }}>
                    Precio de renta: ${flat.rentPrice}
                </Typography>
            </Paper>
            
            <Divider sx={{ my: 4 }} />
            
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Mensajes
                </Typography>
                {user && user.id ? (
                    <FlatMessages 
                        flatId={id} 
                        currentUser={user}
                        flatOwner={flatOwner ? flatOwner.id : null}
                    />
                ) : (
                    <Typography color="textSecondary">
                        Inicia sesión para ver y enviar mensajes.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}