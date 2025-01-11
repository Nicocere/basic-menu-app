"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cart.module.css';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [pickup, setPickup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const handlePayment = () => {
    // Implement Mercado Pago payment integration here
    alert('Pago realizado con éxito');
    setCart([]);
    localStorage.removeItem('cart');
    router.push('/');
  };

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value);
  };

  const handlePickupChange = () => {
    setPickup(!pickup);
  };

  const removeFromCart = (product) => {
    const updatedCart = cart.filter((item) => item.nombre !== product.nombre);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const emptyCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const continueShopping = () => {
    router.push('/');
  };

  return (
    <div className={styles.cartPage}>
      <h1 className={styles.title}>Carrito de Compras</h1>
      {cart.length > 0 ? (
        <div className={styles.cartItems}>
          {cart.map((product) => (
            <div key={product.nombre} className={styles.cartItem}>
              <img src="/fakeProduct.jpg" alt={product.nombre} className={styles.productImage} />
              <div className={styles.productDetails}>
                <h4 className={styles.productName}>{product.nombre}</h4>
                <p className={styles.productPrice}>${product.precio}</p>
                <button onClick={() => removeFromCart(product)} className={styles.removeButton}>Eliminar</button>
              </div>
            </div>
          ))}
          <div className={styles.total}>
            <h3>Total: ${cart.reduce((acc, product) => acc + product.precio, 0)}</h3>
          </div>
          <div className={styles.orderDetails}>
            <label>
              Número de Mesa:
              <input
                type="text"
                value={tableNumber}
                onChange={handleTableNumberChange}
                className={styles.input}
                disabled={pickup}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={pickup}
                onChange={handlePickupChange}
                className={styles.checkbox}
              />
              Retirar por barra
            </label>
          </div>
          <button className={styles.payButton} onClick={handlePayment}>Pagar con Mercado Pago</button>
          <button className={styles.emptyButton} onClick={emptyCart}>Vaciar Carrito</button>
          <button className={styles.continueButton} onClick={continueShopping}>Seguir Comprando</button>
        </div>
      ) : (
        <p className={styles.emptyCart}>El carrito está vacío</p>
      )}
    </div>
  );
}