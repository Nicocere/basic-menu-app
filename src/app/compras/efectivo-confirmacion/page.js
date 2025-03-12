"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaCheckCircle, 
  FaReceipt, 
  FaMapMarkerAlt, 
  FaHome, 
  FaArrowRight, 
  FaMoneyBillWave, 
  FaUtensils, 
  FaChair, 
  FaClock
} from "react-icons/fa";
import { useThemeContext } from "@/context/ThemeSwitchContext";
import styles from './efectivo-confirmacion.module.css';

export default function EfectivoConfirmacion() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isDarkMode } = useThemeContext();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    try {
      // Obtener detalles del pedido del localStorage
      const savedOrder = JSON.parse(localStorage.getItem("order"));
      
      if (!savedOrder) {
        router.push('/');
        return;
      }
      
      setOrderDetails(savedOrder);
      
      // Generar un número de pedido aleatorio para mostrar (esto es solo para UI)
      // En un sistema real, deberías usar el número de pedido real de tu base de datos
      const randomOrderNum = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderNumber(randomOrderNum);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar datos del pedido:", error);
      router.push('/');
    }
  }, [router]);

  // Si todavía estamos cargando los datos, mostrar un spinner
  if (isLoading) {
    return (
      <div className={`${styles.loadingContainer} ${isDarkMode ? styles.darkTheme : ''}`}>
        <div className={styles.spinner}></div>
        <p>Cargando confirmación...</p>
      </div>
    );
  }

  // Si no hay detalles del pedido, no renderizar nada
  if (!orderDetails) return null;

  return (
    <div className={`${styles.confirmationPage} ${isDarkMode ? styles.darkTheme : ''}`}>
      <div className={styles.container}>
        <motion.div 
          className={styles.confirmationCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className={styles.successIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <FaCheckCircle />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className={styles.title}>¡Gracias por tu pedido!</h1>
            <p className={styles.subtitle}>
              Tu pedido ha sido registrado correctamente
            </p>

            <div className={styles.orderNumberContainer}>
              <span className={styles.orderNumberLabel}>NÚMERO DE PEDIDO</span>
              <span className={styles.orderNumber}>#{orderNumber}</span>
            </div>
          </motion.div>

          <motion.div 
            className={styles.infoCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>
              <FaMoneyBillWave className={styles.sectionIcon} />
              Pago en Efectivo
            </h2>
            <div className={styles.paymentInstructions}>
              <p>Por favor sigue estas instrucciones:</p>
              <ul className={styles.instructionsList}>
                <li>
                  <span className={styles.instructionNumber}>1</span>
                  {orderDetails.pickup 
                    ? "Dirígete a la barra para retirar tu pedido" 
                    : `Espera en la mesa ${orderDetails.tableNumber}`}
                </li>
                <li>
                  <span className={styles.instructionNumber}>2</span>
                  Prepara el pago exacto si es posible
                </li>
                <li>
                  <span className={styles.instructionNumber}>3</span>
                  Realiza el pago cuando te entreguen el pedido
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className={styles.orderSummary}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className={styles.sectionTitle}>
              <FaReceipt className={styles.sectionIcon} />
              Resumen del Pedido
            </h2>
            
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Cliente:</span>
                <span className={styles.summaryValue}>{orderDetails.name}</span>
              </div>
              
              {orderDetails.pickup ? (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    <FaUtensils className={styles.inlineIcon} /> Tipo:
                  </span>
                  <span className={`${styles.summaryValue} ${styles.highlight}`}>
                    Retirar por barra
                  </span>
                </div>
              ) : (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    <FaChair className={styles.inlineIcon} /> Mesa:
                  </span>
                  <span className={`${styles.summaryValue} ${styles.highlight}`}>
                    {orderDetails.tableNumber}
                  </span>
                </div>
              )}
              
              {orderDetails.waiterName && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Camarero:</span>
                  <span className={styles.summaryValue}>{orderDetails.waiterName}</span>
                </div>
              )}
              
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <FaClock className={styles.inlineIcon} /> Fecha:
                </span>
                <span className={styles.summaryValue}>
                  {new Date().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.productsContainer}>
                <h3 className={styles.productsTitle}>Productos:</h3>
                <div className={styles.productsList}>
                  {orderDetails.products.map((product, index) => (
                    <div key={index} className={styles.productItem}>
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{product.nombre}</span>
                        <span className={styles.productQuantity}>x{product.quantity || 1}</span>
                      </div>
                      <span className={styles.productPrice}>
                        ${(product.precio * (product.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span className={styles.summaryLabel}>Total a pagar:</span>
                <span className={styles.totalAmount}>${orderDetails.total}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.actions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link href="/" className={styles.primaryButton}>
              <FaHome className={styles.buttonIcon} />
              Volver al Inicio
            </Link>
            
            <Link href="/menu" className={styles.secondaryButton}>
              Ver Menú
              <FaArrowRight className={styles.buttonIcon} />
            </Link>
          </motion.div>

          <div className={styles.contactInfo}>
            <p>
              ¿Tienes alguna pregunta? Contáctanos al <a href="tel:+5491144478490">+54 911 4447 8490</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}