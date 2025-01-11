"use client"

import styles from './page.module.css';
import Link from 'next/link';
import { useState } from 'react';

const products = [
  { id: 1, name: 'Cerveza', price: 5 },
  { id: 2, name: 'Vino', price: 8 },
  { id: 3, name: 'Whisky', price: 10 },
  { id: 4, name: 'Ron', price: 7 },
  { id: 5, name: 'Tequila', price: 9 },
];

export default function Home() {
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
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bienvenido al Bar</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.menu}>
          <h2 className={styles.subtitle}>Menú</h2>
          <ul className={styles.list}>
            {products.map(product => (
              <li key={product.id} className={styles.listItem}>
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.order}>
          <h2 className={styles.subtitle}>Ordenar</h2>
          <form className={styles.form}>
            <label className={styles.label}>
              Producto:
              <select className={styles.select}>
                {products.map(product => (
                  <option key={product.id} value={product.name}>{product.name}</option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Cantidad:
              <input className={styles.input} type="number" min="1" />
            </label>
            <button className={styles.button} type="submit">Ordenar</button>
          </form>
        </section>
        <section className={styles.orderType}>
          <label className={styles.label}>
            <input
              type="radio"
              value="pickup"
              checked={orderType === 'pickup'}
              onChange={handleOrderTypeChange}
            />
            Pickup
          </label>
          <label className={styles.label}>
            <input
              type="radio"
              value="table"
              checked={orderType === 'table'}
              onChange={handleOrderTypeChange}
            />
            Table Service
          </label>
        </section>
        {orderType === 'table' && (
          <section className={styles.tableSelection}>
            <label className={styles.label} htmlFor="table">Seleccionar Mesa:</label>
            <select className={styles.select} id="table" value={selectedTable} onChange={handleTableChange}>
              <option value="">Seleccionar</option>
              {tables.map((table, index) => (
                <option key={index} value={table}>{table}</option>
              ))}
            </select>
          </section>
        )}
        <section className={styles.cart}>
          <h2 className={styles.subtitle}>Carrito</h2>
          {cart.map(product => (
            <div key={product.id} className={styles.cartItem}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button className={styles.button} onClick={() => removeProductFromCart(product.id)}>Remove</button>
            </div>
          ))}
        </section>
        <button className={styles.checkoutButton} onClick={handleCheckout}>Checkout</button>
        <section className={styles.admin}>
          <Link href="/admin">
            <button className={styles.button}>Ir a Admin</button>
          </Link>
        </section>
      </main>
      <footer className={styles.footer}>
        <p className={styles['footer-text']}>&copy; 2023 Bar Menú. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}