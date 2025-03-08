"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CartHome.module.css';
import { FaTrash } from 'react-icons/fa';
// Add to imports
// SUPABASE
import { useAuth } from '@/context/AuthUserContext';
import { useThemeContext } from '@/context/ThemeSwitchContext';
import { PiShoppingCartSimpleFill } from "react-icons/pi";




export default function CartHome() {

  const { isDarkMode, handleThemeChange } = useThemeContext();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const router = useRouter();


  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(savedCart)
    setCart(savedCart);
  }, []);



  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.cartIcon} onClick={() => router.push('/cart')}>
        <PiShoppingCartSimpleFill />
      </div>
      {cart.length > 0 && (
        <div className={styles['container-preview']} >
          <h4 className={styles.cartTitle}>Mi pedido:</h4>
          <div className={styles['search-results']}>
            {cart.map((product) => (
              <div className={styles['preview-list']} key={product.nombre}>
                <img
                  src="/fakeProduct.jpg"
                  alt={product.nombre}
                  className={styles['product-image-mini']}
                />
                <h4 className={styles['product-name']}>{product.nombre}</h4>
                <p className={styles['product-price']}>${product.precio}</p>
                <button onClick={() => removeFromCart(product)} className={styles['remove-button']}>
                  <FaTrash />
                </button>
              </div>
            ))}
            <h3 className={styles['total-price']}>Total: ${cart.reduce((acc, product) => acc + product.precio, 0)}</h3>
            <button className={styles['add-button']} onClick={() => router.push('/cart')}>Pagar</button>
          </div>
        </div>
      )}

    </div>
  );
}