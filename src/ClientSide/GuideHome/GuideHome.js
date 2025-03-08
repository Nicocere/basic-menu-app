"use client";

import { motion } from 'framer-motion';
import { FaSearch, FaCartPlus, FaShoppingCart, FaConciergeBell, FaCheckCircle } from 'react-icons/fa';

import styles from './GuideHome.module.css';

export default function GuideHome() {


  return (
    <section className={styles.userGuide}>
  <motion.div 
    className={styles.guideContainer}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <motion.h2 
      className={styles.guideTitle}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      Proceso de Pedido
    </motion.h2>

    <div className={styles.stepsGrid}>
      {[
        {
          icon: <FaSearch />,
          text: "Explora el menú",
          detail: "Encuentra tus platos favoritos"
        },
        {
          icon: <FaCartPlus />,
          text: "Agrega al carrito",
          detail: "Selecciona las cantidades"
        },
        {
          icon: <FaShoppingCart />,
          text: "Revisa tu pedido",
          detail: "Verifica los detalles"
        },
        {
          icon: <FaConciergeBell />,
          text: "Mesa o barra",
          detail: "Indica dónde recibirlo"
        },
        {
          icon: <FaCheckCircle />,
          text: "¡Confirmado!",
          detail: "Sigue tu orden"
        }
      ].map((step, index) => (
        <motion.div 
          key={index}
          className={styles.step}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.4,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 } 
          }}
        >
          <div className={styles.stepIcon}>
            {step.icon}
            <span className={styles.stepNumber}>{index + 1}</span>
          </div>
          <div className={styles.stepContent}>
            <h3>{step.text}</h3>
            <p>{step.detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
</section>
  );
}