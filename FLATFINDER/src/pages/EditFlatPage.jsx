import React from 'react';
import { useParams } from 'react-router-dom';
import FlatForm from '../components/Flats/FlatForm';
import { Typography, Container, Paper } from '@mui/material';

function EditFlatPage() {
    const { id } = useParams(); // Obtiene el ID del flat de la URL

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Edit Flat
                </Typography>
                <FlatForm flatId={id} />
            </Paper>
        </Container>
    );
}

export default EditFlatPage;