"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './payment.module.css';
import { motion } from 'framer-motion';
import { FaCheck, FaShare, FaDownload, FaReceipt } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

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
      <motion.div 
        className={styles.successIcon}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaCheck />
      </motion.div>

      <motion.div
        className={styles.contentContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className={styles.title}>¡Gracias, {name}!</h1>
        <div className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <div className={styles.orderInfo}>
              <h2 className={styles.orderNumber}>#{orderNumber}</h2>
              <span className={styles.orderStatus}>Pedido Confirmado</span>
            </div>
            <QRCodeSVG 
              value={orderNumber} 
              className={styles.qrCode}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#4e342e"
/>
          </div>

          <div className={styles.deliveryInfo}>
            {pickup ? (
              <div className={styles.pickupInfo}>
                <h3>Retirar por Barra</h3>
                <p>Muestra el código QR en la barra para retirar tu pedido</p>
              </div>
            ) : (
              <div className={styles.tableInfo}>
                <h3>Entrega en Mesa</h3>
                <p>Tu pedido será entregado en la mesa {tableNumber}</p>
              </div>
            )}
          </div>

          <div className={styles.orderDetails}>
            <h3>Detalles del Pedido</h3>
            {cart.map((product) => (
              <motion.div 
                key={product.nombre} 
                className={styles.orderItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className={styles.productName}>{product.nombre}</p>
                <p className={styles.productPrice}>${product.precio}</p>
              </motion.div>
            ))}
            <div className={styles.total}>
              <span>Total</span>
              <span>${cart.reduce((acc, product) => acc + product.precio, 0)}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.actionButton}>
              <FaShare /> Compartir
            </button>
            <button className={styles.actionButton}>
              <FaDownload /> Guardar
            </button>
            <button className={styles.actionButton}>
              <FaReceipt /> Recibo
            </button>
          </div>
        </div>

        <button className={styles.backButton} onClick={handleBackToMenu}>
          Volver al Menú
        </button>
      </motion.div>
    </div>
  );
}