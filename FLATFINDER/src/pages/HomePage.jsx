import React, { useState, useRef } from 'react';
import { Button, ButtonWrapper, ContainerImage, ContentWrapper, Title, Overlay } from './HomePages';
import FlatView from '../components/Flats/FlatView'; // Importamos FlatView en lugar de FlatList
import { flats } from '../data/flats';
import { Box, Grid, Typography } from '@mui/material'; // Importamos componentes de Material-UI para mejorar el diseño

function HomePage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const flatListRef = useRef(null);

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

      {/* Usamos Grid para mostrar los FlatView components */}
      <Box ref={flatListRef} sx={{ padding: '20px' }}>
        <Grid container spacing={3}>
          {filteredFlats.map(flat => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={flat.id}>
              <FlatView flat={flat} />
            </Grid>
          ))}
        </Grid>
        {filteredFlats.length === 0 && (
          <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
            No se encontraron flats que coincidan con los criterios de búsqueda.
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default HomePage;