import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonWrapper, ContainerImage, ContentWrapper, Title, Overlay } from './HomePages';
import FlatView from '../components/Flats/FlatView';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { getAllFlatsWithOwners } from '../services/firebaseFlats'; // Asegúrate de que la ruta sea correcta

function HomePage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        setLoading(true);
        const flatsData = await getAllFlatsWithOwners();
        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching flats:", err);
        setError("Error al cargar los flats. Por favor, intente de nuevo más tarde.");
        setLoading(false);
      }
    };

    fetchFlats();
  }, []);

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

  return (
    <div>
      <ContainerImage>
        <Overlay />
        <ContentWrapper>
          <Title>
            Bienvenido nombre <br />
            Te ayudamos a encontrar tu FLAT
          </Title>
          <ButtonWrapper>
            <Button onClick={scrollToFlatList}>Ver Flats</Button>
          </ButtonWrapper>
        </ContentWrapper>
      </ContainerImage>

      {/* Filtros */}
      <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Box sx={{ margin: '10px' }}>
          <Typography component="label" sx={{ marginRight: '10px' }}>Ciudad:</Typography>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="">Todas</option>
            <option value="Quito">Quito</option>
            <option value="Guayaquil">Guayaquil</option>
            <option value="Cuenca">Cuenca</option>
            <option value="Manta">Manta</option>
            <option value="Ambato">Ambato</option>
            <option value="Loja">Loja</option>
            <option value="Esmeraldas">Esmeraldas</option>
            <option value="Ibarra">Ibarra</option>
          </select>
        </Box>
        <Box sx={{ margin: '10px' }}>
          <Typography component="label" sx={{ marginRight: '10px' }}>Precio máximo:</Typography>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Ingresa un precio"
          />
        </Box>
        <Box sx={{ margin: '10px' }}>
          <Typography component="label" sx={{ marginRight: '10px' }}>Fecha disponible:</Typography>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Box>
      </Box>

      {/* Contenido de Flats */}
      <Box ref={flatListRef} sx={{ padding: '20px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="h6" align="center" color="error" sx={{ marginTop: '20px' }}>
            {error}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredFlats.map(flat => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={flat.id}>
                <FlatView flat={flat} />
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