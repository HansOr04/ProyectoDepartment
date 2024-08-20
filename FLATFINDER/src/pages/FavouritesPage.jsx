import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import FlatView from '../components/Flats/FlatView';
import { getUserFavorites, removeFavorite } from '../services/firebaseFlats';

function FavouritesPage() {
  const [favoriteFlats, setFavoriteFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        setLoading(true);
        try {
          const favorites = await getUserFavorites(user.id);
          setFavoriteFlats(favorites);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (flatId) => {
    try {
      await removeFavorite(user.id, flatId);
      setFavoriteFlats(prevFavorites => prevFavorites.filter(flat => flat.id !== flatId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Flats Favoritos
      </Typography>
      {favoriteFlats.length === 0 ? (
        <Typography>No tienes flats favoritos aún.</Typography>
      ) : (
        <Grid container spacing={3}>
          {favoriteFlats.map(flat => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={flat.id}>
              <FlatView 
                flat={flat} 
                isFavorite={true}
                onToggleFavorite={handleRemoveFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default FavouritesPage;