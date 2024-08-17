import React, { useState } from 'react';

export default function FlatForm({ onSubmit, initialFlat }) {
    const [flat, setFlat] = useState(initialFlat || {
        city: '',
        streetName: '',
        streetNumber: '',
        areaSize: '',
        hasAC: false,
        yearBuilt: '',
        rentPrice: '',
        dateAvailable: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFlat({
            ...flat,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(flat);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Formulario de Flat</h1>
            <input
                type="text"
                name="city"
                value={flat.city}
                onChange={handleChange}
                placeholder="Ciudad"
                required
            />
            <input
                type="text"
                name="streetName"
                value={flat.streetName}
                onChange={handleChange}
                placeholder="Nombre de la Calle"
                required
            />
            <input
                type="number"
                name="streetNumber"
                value={flat.streetNumber}
                onChange={handleChange}
                placeholder="Número de la Calle"
                required
            />
            <input
                type="number"
                name="areaSize"
                value={flat.areaSize}
                onChange={handleChange}
                placeholder="Tamaño del Área (m²)"
                required
            />
            <label>
                <input
                    type="checkbox"
                    name="hasAC"
                    checked={flat.hasAC}
                    onChange={handleChange}
                />
                ¿Tiene Aire Acondicionado?
            </label>
            <input
                type="number"
                name="yearBuilt"
                value={flat.yearBuilt}
                onChange={handleChange}
                placeholder="Año de Construcción"
                required
            />
            <input
                type="number"
                name="rentPrice"
                value={flat.rentPrice}
                onChange={handleChange}
                placeholder="Precio de Alquiler"
                required
            />
            <input
                type="date"
                name="dateAvailable"
                value={flat.dateAvailable}
                onChange={handleChange}
                required
            />
            <button type="submit">Guardar Flat</button>
        </form>
    );
}
