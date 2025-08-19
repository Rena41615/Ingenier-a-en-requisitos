import React, { useEffect, useState } from 'react';
import { fetchInventoryItems } from '../services/api';

const InventarioList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getInventoryItems = async () => {
            try {
                const data = await fetchInventoryItems();
                setItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getInventoryItems();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Lista de Inventario</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.nombre} - Cantidad: {item.cantidad}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InventarioList;