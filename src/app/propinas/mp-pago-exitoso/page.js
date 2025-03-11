"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './propinasMP.module.css';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaShare, 
  FaDownload, 
  FaReceipt, 
  FaUserTie, 
  FaChair,
  FaMoneyBillWave,
  FaCalendarAlt
} from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { useThemeContext } from '@/context/ThemeSwitchContext';

export default function TipThanks() {
  const [tipId, setTipId] = useState('');
  const [amount, setAmount] = useState(0);
  const [waiterName, setWaiterName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();
  const {isDarkMode} = useThemeContext();

  useEffect(() => {
    // Recuperar datos de la propina desde localStorage o parámetros URL
    const savedAmount = localStorage.getItem('tipAmount') || '100';
    const savedWaiter = localStorage.getItem('waiterName') || 'Carlos';
    const savedTable = localStorage.getItem('tableNumber') || '5';
    
    setAmount(parseFloat(savedAmount));
    setWaiterName(savedWaiter);
    setTableNumber(savedTable);
    setTipId(Math.floor(100000 + Math.random() * 900000).toString());
    setDate(new Date().toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, []);

  const handleBackToMenu = () => {
    // Limpiar datos de propina del localStorage
    localStorage.removeItem('tipAmount');
    localStorage.removeItem('waiterName');
    localStorage.removeItem('tableNumber');
    router.push('/');
  };

  // Calcular impacto emocional basado en el monto
  const getEmotionalImpact = () => {
    if (amount >= 1000) return "¡Increíble generosidad!";
    if (amount >= 500) return "¡Fantástico gesto!";
    if (amount >= 200) return "¡Excelente propina!";
    return "¡Gracias por tu propina!";
  };

  return (
    <div className={`${styles.thanksPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <motion.div 
        className={styles.successIcon}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaHeart />
      </motion.div>

      <motion.div
        className={styles.contentContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className={styles.title}>{getEmotionalImpact()}</h1>
        <div className={styles.tipCard}>
          <div className={styles.tipHeader}>
            <div className={styles.tipInfo}>
              <h2 className={styles.tipId}>#{tipId}</h2>
              <span className={styles.tipStatus}>Propina Procesada</span>
            </div>
            <QRCodeSVG 
              value={`PROPINA:${tipId}:${amount}:${waiterName}`} 
              className={styles.qrCode}
              size={120}
              level="M"
              marginSize={10}
              bgColor="#ffffff"
              fgColor="#8D4E31"
            />
          </div>

          <div className={styles.dateInfo}>
            <FaCalendarAlt className={styles.infoIcon} />
            <p>{date}</p>
          </div>

          <div className={styles.waiterInfo}>
            <div className={styles.infoRow}>
              <FaUserTie className={styles.infoIcon} />
              <div>
                <h3>Camarero</h3>
                <p>{waiterName}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <FaChair className={styles.infoIcon} />
              <div>
                <h3>Mesa</h3>
                <p>#{tableNumber}</p>
              </div>
            </div>
          </div>

          <div className={styles.tipDetails}>
            <h3>Detalle de la Propina</h3>
            <motion.div 
              className={styles.tipAmount}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FaMoneyBillWave className={styles.moneyIcon} />
              <span className={styles.amount}>${amount.toFixed(2)}</span>
            </motion.div>
            <p className={styles.tipMessage}>
              Tu generosidad hace la diferencia. Esta propina va directamente a quien te atendió.
            </p>
          </div>

          <div className={styles.impactInfo}>
            <h3>Impacto de tu Propina</h3>
            <p>Las propinas representan un complemento importante para los ingresos de nuestros camareros.</p>
            <div className={styles.impactDetail}>
              <div className={styles.impactItem}>
                <div className={styles.impactValue}>100%</div>
                <div className={styles.impactLabel}>Va directamente al camarero</div>
              </div>
              <div className={styles.impactItem}>
                <div className={styles.impactValue}>+30%</div>
                <div className={styles.impactLabel}>Mejora en sus ingresos</div>
              </div>
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
              <FaReceipt /> Comprobante
            </button>
          </div>
        </div>

        <motion.div 
          className={styles.testimonial}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>"Gracias por valorar nuestro servicio. Tu propina es una forma de reconocimiento que nos motiva a seguir mejorando."</p>
          <p className={styles.signature}>El equipo de camareros</p>
        </motion.div>

        <button className={styles.backButton} onClick={handleBackToMenu}>
          Volver al Menú
        </button>
      </motion.div>
    </div>
  );
}