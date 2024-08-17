import React, { useState } from 'react';
import { Card, CardMedia, Typography, Box } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function FlatView({ flat }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
            <Card sx={{ 
                boxShadow: 3, 
                padding: 2, 
                borderRadius: 2, 
                maxWidth: 300, 
                height: 450, // Aumentar la altura de la tarjeta
                textAlign: 'center', 
                backgroundColor: 'rgba(242, 230, 207, 0.3)' // Color con 30% de opacidad
            }}>
                <CardMedia
                    component="img"
                    image={flat.imageUrl}
                    alt={`${flat.streetName} ${flat.streetNumber}`}
                    sx={{ borderRadius: 1, height: 200, objectFit: 'cover', margin: '0 auto' }}
                />
                <Typography
                    variant="body2"
                    component="p"
                    sx={{ color: "gray", mt: 1 }}
                >
                    {flat.streetName}, {flat.streetNumber}
                </Typography>
                <Typography
                    variant='h6'
                    component="h3"
                    sx={{ mt: 0.5 }}
                >
                    {flat.city}, {flat.country}
                </Typography>
                <Typography
                    variant="body2"
                    component="p"
                    sx={{ mt: 0.5 }}
                >
                    {flat.description}, construido en {flat.yearBuilt}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarMonthIcon sx={{ mr: 0.5, fontSize: 18, color: '#114C5F' }} />
                        <Typography variant="body2" component="p">
                            {flat.dateAvailable}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AcUnitIcon sx={{ mr: 0.5, fontSize: 18, color: '#114C5F' }} />
                        <Typography variant="body2" component="p">
                            {flat.hasAC ? 'Tiene AC' : 'No tiene AC'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ZoomOutMapIcon sx={{ mr: 0.5, fontSize: 18, color: '#114C5F' }} />
                        <Typography variant="body2" component="p">
                            {flat.areaSize} m²
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" component="p" sx={{ fontSize: '1.7rem', paddingLeft: 1.5,paddingTop:2.5 }}>
                        ${flat.rentPrice}
                    </Typography>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            cursor: 'pointer', 
                            color: isFavorite ? 'red' : 'inherit' 
                        }} 
                        onClick={handleFavoriteClick}
                    >
                        <FavoriteBorderIcon sx={{ fontSize: 24, color: isFavorite ? 'red' : 'inherit',paddingTop:2.5 }} />
                        <Typography variant="body2" component="p" sx={{ ml: 0.5, fontSize: '1rem', paddingTop:2.5 }}>
                            {isFavorite ? 'Favorito' : 'Marcar como favorito'}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}
