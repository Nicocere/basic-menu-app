"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './payment.module.css';
// import QRCode from 'qrcode.react';

export default function Payment() {
  const [orderNumber, setOrderNumber] = useState('');
  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [pickup, setPickup] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedName = localStorage.getItem('name') || '';
    const savedPickup = JSON.parse(localStorage.getItem('pickup')) || false;
    const savedTableNumber = localStorage.getItem('tableNumber') || '';
    setCart(savedCart);
    setName(savedName);
    setPickup(savedPickup);
    setTableNumber(savedTableNumber);
    setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
  }, []);

  const handleBackToMenu = () => {
    console.log("delete carrito")
    localStorage.removeItem('cart');
    router.push('/');
  };

  return (
    <div className={styles.paymentPage}>
      <h1 className={styles.title}>¡Gracias, {name}!</h1>
      <p className={styles.orderNumber}>Número de Orden: {orderNumber}</p>
      {/* <QRCode value={orderNumber} className={styles.qrCode} /> */}
      {pickup ? (
        <p className={styles.message}>Por favor, muestra este código para retirar tu pedido en la barra.</p>
      ) : (
        <p className={styles.message}>Tu pedido será entregado en la mesa {tableNumber}.</p>
      )}
      <div className={styles.orderDetails}>
        <h2>Detalles del Pedido:</h2>
        {cart.map((product) => (
          <div key={product.nombre} className={styles.orderItem}>
            <p className={styles.productName}>{product.nombre}</p>
            <p className={styles.productPrice}>${product.precio}</p>
          </div>
        ))}
        <h3 className={styles.total}>Total: ${cart.reduce((acc, product) => acc + product.precio, 0)}</h3>
      </div>
      <button className={styles.backButton} onClick={handleBackToMenu}>Volver al Menú</button>
    </div>
  );
}