import React, { useState, useRef } from 'react';
import { Button, ButtonWrapper, ContainerImage, ContentWrapper, Title, Overlay } from './HomePages';
import FlatList from '../components/Flats/FlatList'; // Asegúrate de que la ruta sea correcta
import { flats } from '../data/flats';

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
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <label>Ciudad:</label>
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
        </div>
        <div>
          <label>Precio máximo:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Ingresa un precio"
          />
        </div>
        <div>
          <label>Fecha disponible:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Usa FlatList para mostrar los flats filtrados y asigna la referencia */}
      <div ref={flatListRef}>
        <FlatList flats={filteredFlats} />
      </div>
    </div>
  );
}

export default HomePage;
