import React, { useState } from 'react';
import styles from '../../../styles/components/Client/Order.module.css';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

const Order = () => {
    const [orderDetails, setOrderDetails] = useState({
        name: '',
        item: '',
        quantity: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({
            ...orderDetails,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí se puede manejar el envío del pedido
        console.log('Pedido realizado:', orderDetails);
    };

    return (
        <div className={styles.orderContainer}>
            <h2>Realizar Pedido</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={orderDetails.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="item"
                    placeholder="Artículo"
                    value={orderDetails.item}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="number"
                    name="quantity"
                    placeholder="Cantidad"
                    value={orderDetails.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                />
                <Button type="submit">Enviar Pedido</Button>
            </form>
        </div>
    );
};

export default Order;