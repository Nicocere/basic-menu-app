"use client";

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

const products = [
  { id: 1, name: 'Cerveza', price: 5 },
  { id: 2, name: 'Vino', price: 8 },
  { id: 3, name: 'Whisky', price: 10 },
  { id: 4, name: 'Ron', price: 7 },
  { id: 5, name: 'Tequila', price: 9 },
];

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/admin">Admin</Link>
        <h1 className={styles['header-title']}>Bienvenido al Bar</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles['section-title']}>Menú</h2>
          <ul className={styles.list}>
            {products.map((product) => (
              <li key={product.id} className={styles['list-item']}>
                {product.name} - ${product.price}
                <button className={styles.button} onClick={() => addToCart(product)}>Agregar</button>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles['section-title']}>Carrito de Compras</h2>
          <ul className={styles.list}>
            {cart.map((item, index) => (
              <li key={index} className={styles['list-item']}>
                {item.name} - ${item.price}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className={styles.footer}>
        <p className={styles['footer-text']}>&copy; 2023 Bar Menú. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}