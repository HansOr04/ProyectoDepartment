import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonWrapper, ContainerImage, ContentWrapper, Title, Overlay } from '../pages/HomePages';
import FlatView from '../components/Flats/FlatView';
import { Box, Grid, Typography, Select, MenuItem, TextField, Skeleton } from '@mui/material';
import { getAllFlatsWithOwners, addToFavorites, removeFavorite } from '../services/firebaseFlats';
import { useAuth } from '../contexts/authContext';

function HomePage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        setLoading(true);
        const flatsData = await getAllFlatsWithOwners();
        if (user && user.favorites) {
          flatsData.forEach(flat => {
            flat.isFavorite = user.favorites.includes(flat.id);
          });
        }
        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching flats:", err);
        setError("Error al cargar los flats. Por favor, intente de nuevo más tarde.");
        setLoading(false);
      }
    };

    fetchFlats();
  }, [user]);

  const handleToggleFavorite = async (flatId) => {
    if (!user) {
      alert("Por favor, inicia sesión para agregar favoritos.");
      return;
    }

    try {
      const flat = flats.find(f => f.id === flatId);
      if (flat.isFavorite) {
        await removeFavorite(user.id, flatId);
      } else {
        await addToFavorites(user.id, flatId);
      }
      
      setFlats(prevFlats => prevFlats.map(f => 
        f.id === flatId ? { ...f, isFavorite: !f.isFavorite } : f
      ));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Hubo un error al actualizar los favoritos. Por favor, intenta de nuevo.");
    }
  };

  const scrollToFlatList = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredFlats = flats.filter(flat => {
    return (
      (selectedCity === '' || flat.city === selectedCity) &&
      (maxPrice === '' || flat.rentPrice <= parseInt(maxPrice)) &&
      (selectedDate === '' || new Date(flat.dateAvailable) >= new Date(selectedDate))
    );
  });

  const getUserFullName = () => {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user && user.firstName) {
      return user.firstName;
    } else if (user && user.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

  const LoadingSkeleton = () => (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {[...Array(8)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box sx={{ width: '100%', marginRight: 0, my: 5 }}>
              <Skeleton variant="rectangular" width="100%" height={118} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  console.log('User object:', user);

  return (
    <div>
      <ContainerImage>
        <Overlay />
        <ContentWrapper>
          <Title>
            Bienvenido {getUserFullName()} <br />
            Te ayudamos a encontrar tu FLAT
          </Title>
          <ButtonWrapper>
            <Button onClick={scrollToFlatList}>Ver Flats</Button>
          </ButtonWrapper>
        </ContentWrapper>
      </ContainerImage>

      <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Box sx={{ margin: '10px', minWidth: 120 }}>
          <Typography component="label" sx={{ marginRight: '10px' }}>Ciudad:</Typography>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="">
              <em>Todas</em>
            </MenuItem>
            <MenuItem value="Quito">Quito</MenuItem>
            <MenuItem value="Guayaquil">Guayaquil</MenuItem>
            <MenuItem value="Cuenca">Cuenca</MenuItem>
            <MenuItem value="Manta">Manta</MenuItem>
            <MenuItem value="Ambato">Ambato</MenuItem>
            <MenuItem value="Loja">Loja</MenuItem>
            <MenuItem value="Esmeraldas">Esmeraldas</MenuItem>
            <MenuItem value="Ibarra">Ibarra</MenuItem>
          </Select>
        </Box>
        <Box sx={{ margin: '10px' }}>
          <Typography component="label" sx={{ marginRight: '10px' }}>Precio máximo:</Typography>
          <TextField
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Ingresa un precio"
          />
        </Box>
        <Box sx={{ margin: '10px' }}>
          <Typography component="label" sx={{ marginRight: '10px' }}>Fecha disponible:</Typography>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </Box>

      <Box ref={flatListRef} sx={{ padding: '20px' }}>
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Typography variant="h6" align="center" color="error" sx={{ marginTop: '20px' }}>
            {error}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredFlats.map(flat => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={flat.id}>
                <FlatView 
                  flat={flat}
                  isFavorite={flat.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {!loading && !error && filteredFlats.length === 0 && (
          <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
            No se encontraron flats que coincidan con los criterios de búsqueda.
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default HomePage;