"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PropinasHome.module.css';
import { FaMoneyBillWave, FaUserTie, FaChair, FaHeart, FaCreditCard, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '@/config/supabaseClient';
import { useThemeContext } from '@/context/ThemeSwitchContext';
import MercadoPagoPropinas from '../MercadoPagoPropinas/MercadoPagoPropinas';

export default function PropinasHome() {
  const { isDarkMode } = useThemeContext();
  const [mesa, setMesa] = useState('');
  const [camarero, setCamarero] = useState('');
  const [propina, setPropina] = useState('');
  const [propinaCustom, setPropinaCustom] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  // Estados para datos de Supabase
  const [mesas, setMesas] = useState([]);
  const [camareros, setCamareros] = useState([]);
  const [loadingMesas, setLoadingMesas] = useState(true);
  const [loadingCamareros, setLoadingCamareros] = useState(true);
  const [error, setError] = useState(null);
  
  const montosPredefinidos = [100, 200, 500, 1000];

  // Cargar mesas desde Supabase
  useEffect(() => {
    const fetchMesas = async () => {
      try {
        setLoadingMesas(true);
        const { data, error } = await supabase
          .from('tables')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setMesas(data || []);
      } catch (err) {
        console.error('Error al cargar las mesas:', err);
        setError('No se pudieron cargar las mesas');
      } finally {
        setLoadingMesas(false);
      }
    };
    
    fetchMesas();
  }, []);
  
  // Cargar camareros desde Supabase
  useEffect(() => {
    const fetchCamareros = async () => {
      try {
        setLoadingCamareros(true);
        const { data, error } = await supabase
          .from('waiters')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setCamareros(data || []);
      } catch (err) {
        console.error('Error al cargar los camareros:', err);
        setError('No se pudieron cargar los camareros');
      } finally {
        setLoadingCamareros(false);
      }
    };
    
    fetchCamareros();
  }, []);

  // Validar el formulario cuando cambien los inputs
  useEffect(() => {
    const isValid = 
      mesa !== '' && 
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

  const handleContinueToPayment = () => {
    // Guardar los datos en localStorage para recuperarlos en la página de éxito
    const selectedMesaObj = mesas.find(m => m.id === mesa);
    const selectedCamareroObj = camareros.find(c => c.id === Number(camarero));
    
    // Guardar los detalles para la página de agradecimiento
    localStorage.setItem('tipAmount', propina || propinaCustom);
    localStorage.setItem('waiterName', selectedCamareroObj?.name || '');
    localStorage.setItem('tableNumber', selectedMesaObj?.name || '');
    
    // Mostrar la pantalla de pago
    setShowPayment(true);
  };

  const handleBackToForm = () => {
    setShowPayment(false);
  };

  // Obtener el monto final de la propina
  const montoFinal = propina || Number(propinaCustom);
  
  // Obtener datos del camarero y mesa seleccionados
  const selectedMesa = mesas.find(m => m.id === mesa);
  const selectedCamarero = camareros.find(c => c.id === Number(camarero));

  

  // Crear un producto para Mercado Pago con la propina
  const tipProduct = {
    id: 'tip-' + Date.now(),
    nombre: 'Propina para ' + (selectedCamarero?.name || 'Camarero'),
    descripcion: 'Mesa ' + (selectedMesa?.name || ''),
    precio: montoFinal,
    quantity: 1
  };

  return (
    <motion.div 
      className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {showPayment ? (
          <motion.div 
            key="payment" 
            className={styles.paymentContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <button 
              className={styles.backToFormButton} 
              onClick={handleBackToForm}
            >
              <FaArrowLeft /> Volver
            </button>
            
            <div className={styles.paymentSummary}>
              <h2>Resumen de propina</h2>
              {selectedCamarero && (
                <div className={styles.summaryItem}>
                  <FaUserTie className={styles.summaryIcon} />
                  <div>
                    <span className={styles.summaryLabel}>Camarero:</span>
                    <span className={styles.summaryValue}>{selectedCamarero.name}</span>
                  </div>
                </div>
              )}
              
              {selectedMesa && (
                <div className={styles.summaryItem}>
                  <FaChair className={styles.summaryIcon} />
                  <div>
                    <span className={styles.summaryLabel}>Mesa:</span>
                    <span className={styles.summaryValue}>{selectedMesa.name}</span>
                  </div>
                </div>
              )}
              
              <div className={styles.summaryItem}>
                <FaMoneyBillWave className={styles.summaryIcon} />
                <div>
                  <span className={styles.summaryLabel}>Monto:</span>
                  <span className={styles.summaryValue}>${montoFinal}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.mercadoPagoContainer}>
              <MercadoPagoPropinas 
                products={[tipProduct]}
                tableNumber={selectedMesa?.name || ''}
                customerName="Cliente"
                customerPhone=""
                pickup={false}
                total={montoFinal}
                onSuccess={() => {
                  // No es necesario hacer nada aquí, MercadoPago redireccionará
                  // automáticamente a la página de éxito
                }}
              />
            </div>
          </motion.div>
        ) : showThanks ? (
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
            {selectedCamarero && (
              <p className={styles.camareroThanks}>
                {selectedCamarero.name} te agradece por valorar su servicio.
              </p>
            )}
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

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaChair className={styles.icon} />
                Mesa
              </label>
              {loadingMesas ? (
                <div className={styles.loadingIndicator}>
                  <FaSpinner className={styles.spinner} /> Cargando mesas...
                </div>
              ) : (
                <select
                  className={styles.select}
                  value={mesa}
                  onChange={(e) => setMesa(e.target.value)}
                  required
                >
                  <option value="">Selecciona una mesa</option>
                  {mesas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaUserTie className={styles.icon} />
                Camarero
              </label>
              {loadingCamareros ? (
                <div className={styles.loadingIndicator}>
                  <FaSpinner className={styles.spinner} /> Cargando camareros...
                </div>
              ) : (
                <select
                  className={styles.select}
                  value={camarero}
                  onChange={(e) => setCamarero(e.target.value)}
                  required
                >
                  <option value="">Selecciona un camarero</option>
                  {camareros.map((cam) => (
                    <option key={cam.id} value={cam.id}>{cam.name}</option>
                  ))}
                </select>
              )}
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
              disabled={!isFormValid || loadingMesas || loadingCamareros}
              onClick={handleContinueToPayment}
            >
              <FaCreditCard className={styles.cardIcon} />
              Continuar al pago
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}