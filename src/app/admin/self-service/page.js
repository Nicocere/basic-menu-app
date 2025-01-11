"use client";

import { useState } from 'react';
import Head from 'next/head';
import styles from './selfService.module.css';

export default function SelfService() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Cerveza', description: 'Cerveza fría', price: 5 },
        { id: 2, name: 'Vino', description: 'Vino tinto', price: 8 },
        { id: 3, name: 'Whisky', description: 'Whisky escocés', price: 10 }
    ]);
    const [cart, setCart] = useState([]);
    const [orderType, setOrderType] = useState('pickup'); // 'pickup' or 'table'
    const [selectedTable, setSelectedTable] = useState('');
    const [tables, setTables] = useState(['Mesa 1', 'Mesa 2', 'Mesa 3']);

    const addProductToCart = (product) => {
        setCart([...cart, product]);
    };

    const removeProductFromCart = (productId) => {
        setCart(cart.filter(product => product.id !== productId));
    };

    const handleOrderTypeChange = (event) => {
        setOrderType(event.target.value);
    };

    const handleTableChange = (event) => {
        setSelectedTable(event.target.value);
    };

    const handleCheckout = () => {
        // Handle checkout logic here
        console.log('Checkout', { cart, orderType, selectedTable });
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Self Service</title>
                <meta name="description" content="Self Service for Customers" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Self Service</h1>

                <div className={styles.orderType}>
                    <label>
                        <input
                            type="radio"
                            value="pickup"
                            checked={orderType === 'pickup'}
                            onChange={handleOrderTypeChange}
                        />
                        Pickup
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="table"
                            checked={orderType === 'table'}
                            onChange={handleOrderTypeChange}
                        />
                        Table Service
                    </label>
                </div>

                {orderType === 'table' && (
                    <div className={styles.tableSelection}>
                        <label htmlFor="table">Seleccionar Mesa:</label>
                        <select id="table" value={selectedTable} onChange={handleTableChange}>
                            <option value="">Seleccionar</option>
                            {tables.map((table, index) => (
                                <option key={index} value={table}>{table}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className={styles.products}>
                    {products.map(product => (
                        <div key={product.id} className={styles.product}>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>${product.price}</p>
                            <button onClick={() => addProductToCart(product)}>Add to Cart</button>
                        </div>
                    ))}
                </div>

                <div className={styles.cart}>
                    <h2>Cart</h2>
                    {cart.map(product => (
                        <div key={product.id} className={styles.cartItem}>
                            <h3>{product.name}</h3>
                            <p>${product.price}</p>
                            <button onClick={() => removeProductFromCart(product.id)}>Remove</button>
                        </div>
                    ))}
                </div>

                <button className={styles.checkoutButton} onClick={handleCheckout}>Checkout</button>
            </main>
        </div>
    );
}