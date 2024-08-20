import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { getFlatsByUser, deleteFlat } from '../services/firebaseFlats';
import FlatView from '../components/Flats/FlatView';
import { CircularProgress, Typography, Box } from '@mui/material';

function MyFlatsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
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

    const handleEdit = (flat) => {
        navigate(`/edit-flat/${flat.id}`);
    };

    const handleDelete = async (flatId) => {
        if (window.confirm("Are you sure you want to delete this flat?")) {
            try {
                await deleteFlat(flatId);
                setFlats(flats.filter(flat => flat.id !== flatId));
            } catch (error) {
                console.error("Error deleting flat:", error);
                setError("Failed to delete flat. Please try again.");
            }
        }
    };

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
                    gridTemplateColumns="repeat(auto-fill, minmax(350px, 1fr))"
                    gap={3}
                >
                    {flats.map(flat => (
                        <FlatView 
                            key={flat.id} 
                            flat={flat} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            showActions={true}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default MyFlatsPage;