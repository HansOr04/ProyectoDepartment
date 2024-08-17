import React from 'react';
import FlatView from './FlatView'; // Importa el componente FlatView

export default function FlatList({ flats }) {
    return (
        <div 
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px',
            }}
        >
            {flats.map((flat) => (
                <FlatView key={flat.id} flat={flat} /> 
            ))}
        </div>
    );
}
