import React from 'react';
import FlatView from './FlatView'; // Import the FlatView component
import { Box } from '@mui/material'; // Import Box from Material-UI for responsive grid

export default function FlatList({ flats }) {
    return (
        <Box 
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',                    // 1 column on extra-small screens
                    sm: 'repeat(2, 1fr)',         // 2 columns on small screens
                    md: 'repeat(3, 1fr)',         // 3 columns on medium screens
                    lg: 'repeat(4, 1fr)',         // 4 columns on large screens
                },
                gap: 3,
                padding: 3,
            }}
        >
            {flats.map((flat) => (
                <FlatView key={flat.id} flat={flat} />
            ))}
        </Box>
    );
}