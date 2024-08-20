import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext'; // Asegúrate de que la ruta sea correcta
import { getFlatsByUser } from '../services/firebaseFlats'; // Asegúrate de que la ruta sea correcta
import FlatView from '../components/Flats/FlatView'; // Asegúrate de que la ruta sea correcta
import { CircularProgress, Typography, Box } from '@mui/material';

function MyFlatsPage() {
    const { user } = useAuth();
    const [flats, setFlats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadFlats() {
            if (user) {
                try {
                    const userFlats = await getFlatsByUser(user.id);
                    setFlats(userFlats);
                } catch (err) {
                    console.error("Error loading flats:", err);
                    setError("Failed to load flats. Please try again later.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setError("Please log in to view your flats.");
            }
        }

        loadFlats();
    }, [user]);

    if (loading) {
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

    return (
        <Box padding={3}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Flats
            </Typography>
            {flats.length === 0 ? (
                <Typography>You haven't added any flats yet.</Typography>
            ) : (
                <Box 
                    display="grid" 
                    gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
                    gap={3}
                >
                    {flats.map(flat => (
                        <FlatView key={flat.id} flat={flat} />
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default MyFlatsPage;