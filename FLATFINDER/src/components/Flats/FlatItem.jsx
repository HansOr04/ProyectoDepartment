import React from 'react';
import { Link } from 'react-router-dom';

export default function FlatItem({ flat }) {
    return (
        <div style={{ width: '300px', marginRight: '16px' }}>
            <Link to={`/flat/${flat.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img 
                    src={flat.imageUrl} 
                    alt={`Flat en ${flat.city}`} 
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                />
                <h2 style={{ fontSize: '1.2rem', margin: '8px 0' }}>
                    {flat.streetName}, {flat.streetNumber}, {flat.city}
                </h2>
            </Link>
        </div>
    );
}
