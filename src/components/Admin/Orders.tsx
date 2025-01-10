import React, { useEffect, useState } from 'react';
import styles from '../../../styles/components/Admin/Orders.module.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Simulación de una llamada a una API para obtener los pedidos
        const fetchOrders = async () => {
            const response = await fetch('/api/orders'); // Cambiar por la URL real de la API
            const data = await response.json();
            setOrders(data);
        };

        fetchOrders();
    }, []);

    const handleDeleteOrder = async (orderId) => {
        // Simulación de una llamada a una API para eliminar un pedido
        await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
        });
        setOrders(orders.filter(order => order.id !== orderId));
    };

    return (
        <div className={styles.ordersContainer}>
            <h1>Pedidos</h1>
            <table className={styles.ordersTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.client}</td>
                            <td>{order.product}</td>
                            <td>{order.quantity}</td>
                            <td>
                                <button onClick={() => handleDeleteOrder(order.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;