"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PropinasHome.module.css';
import { FaMoneyBillWave, FaUserTie, FaChair, FaHeart, FaCreditCard } from 'react-icons/fa';

export default function PropinasHome() {
  const [mesa, setMesa] = useState('');
  const [camarero, setCamarero] = useState('');
  const [propina, setPropina] = useState('');
  const [propinaCustom, setPropinaCustom] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  
  const montosPredefinidos = [100, 200, 500, 1000];
  
  // Lista de camareros (en producción esto vendría de una API/base de datos)
  const camareros = [
    'Carlos Rodríguez',
    'María Gómez',
    'Alejandro López',
    'Sofía Martínez',
    'Juan Pérez'
  ];

  // Validar el formulario cuando cambien los inputs
  useEffect(() => {
    const isValid = 
      mesa.trim() !== '' && 
      camarero !== '' && 
      (propina !== '' || (propinaCustom !== '' && !isNaN(propinaCustom) && Number(propinaCustom) > 0));
    
    setIsFormValid(isValid);
  }, [mesa, camarero, propina, propinaCustom]);

  const handleSelectPropina = (monto) => {
    setPropina(monto);
    setPropinaCustom('');
  };

  const handleCustomPropinaChange = (e) => {
    setPropinaCustom(e.target.value);
    setPropina('');
  };

  const handleSubmit = () => {
    const montoFinal = propina || Number(propinaCustom);
    console.log({
      mesa,
      camarero,
      propina: montoFinal
    });
    
    // Aquí iría la integración real con Mercado Pago
    // Por ahora solo mostramos el mensaje de agradecimiento
    setShowThanks(true);
    
    // Resetear después de 5 segundos
    setTimeout(() => {
      setShowThanks(false);
      setMesa('');
      setCamarero('');
      setPropina('');
      setPropinaCustom('');
    }, 5000);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {showThanks ? (
          <motion.div 
            key="thanks" 
            className={styles.thanksContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <FaHeart className={styles.heartIcon} />
            <h2>¡Gracias por tu generosidad!</h2>
            <p>Tu propina significa mucho para nuestro equipo.</p>
            <p className={styles.camareroThanks}>
              {camarero} te agradece por valorar su servicio.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="form" 
            className={styles.formContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className={styles.title}>Reconoce el Buen Servicio</h1>
            <p className={styles.subtitle}>
              Tus propinas son una forma de agradecer el excelente servicio de nuestro personal.
            </p>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaChair className={styles.icon} />
                Mesa
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="Número de mesa o ubicación"
                value={mesa}
                onChange={(e) => setMesa(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaUserTie className={styles.icon} />
                Camarero
              </label>
              <select
                className={styles.select}
                value={camarero}
                onChange={(e) => setCamarero(e.target.value)}
                required
              >
                <option value="">Selecciona un camarero</option>
                {camareros.map((cam) => (
                  <option key={cam} value={cam}>{cam}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaMoneyBillWave className={styles.icon} />
                Monto de propina
              </label>
              
              <div className={styles.amountButtons}>
                {montosPredefinidos.map((monto) => (
                  <button
                    key={monto}
                    type="button"
                    className={`${styles.amountButton} ${propina === monto ? styles.selected : ''}`}
                    onClick={() => handleSelectPropina(monto)}
                  >
                    ${monto}
                  </button>
                ))}
              </div>
              
              <div className={styles.customAmount}>
                <span className={styles.dollarSign}>$</span>
                <input
                  type="number"
                  className={styles.customInput}
                  placeholder="Ingresa otro monto"
                  value={propinaCustom}
                  onChange={handleCustomPropinaChange}
                  min="1"
                />
              </div>
            </div>

            <div className={styles.infoText}>
              <p>
                El 100% de tu propina va directamente a nuestro personal.
                Gracias por reconocer su trabajo y dedicación.
              </p>
            </div>

            <button 
              className={`${styles.payButton} ${isFormValid ? '' : styles.disabled}`}
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              <FaCreditCard className={styles.cardIcon} />
              Pagar con Mercado Pago
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}