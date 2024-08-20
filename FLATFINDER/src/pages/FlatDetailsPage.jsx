import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, Grid, Button, Divider } from '@mui/material';
import { getFlatByID } from '../services/firebaseFlats';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlatMessages from '../components/Flats/FlatMessages'; // Importamos el componente FlatMessages

export default function FlatDetailsPage() {
    const { id } = useParams();
    const [flat, setFlat] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlat = async () => {
            try {
                const flatData = await getFlatByID(id);
                setFlat(flatData);
            } catch (error) {
                console.error("Error fetching flat details:", error);
            }
        };

        fetchFlat();
    }, [id]);

    if (!flat) {
        return <Typography>Loading...</Typography>;
    }

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ marginBottom: 2 }}
            >
                Volver
            </Button>
            <Card sx={{ boxShadow: 3, borderRadius: 2, marginBottom: 4 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={flat.imageURL || 'https://via.placeholder.com/300x200'}
                    alt={`${flat.streetName} ${flat.streetNumber}`}
                />
                <Box sx={{ padding: 3 }}>
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
                            <Typography variant="body1">Disponible desde: {new Date(flat.dateAvailable?.toDate()).toLocaleDateString()}</Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="h5" component="p" sx={{ marginTop: 2 }}>
                        Precio de renta: ${flat.rentPrice}
                    </Typography>
                </Box>
            </Card>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Componente de mensajes */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Mensajes sobre este flat
                </Typography>
                <FlatMessages flatId={id} />
            </Box>
        </Box>
    );
}