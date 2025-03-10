"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PiTipJarBold } from "react-icons/pi";

import styles from './PropinasButton.module.css';

export default function PropinasButton() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  const navigateToPropinas = () => {
    router.push('/propinas');
  };

  // Variantes para las animaciones
  const buttonVariants = {
    initial: {
      scale: 1,
      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    tap: {
      scale: 0.95,
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)"
    }
  };

  // Nueva animación sutil del icono
  const iconVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -5, 0],
      rotate: [0, -5, 0, 5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 1],
        repeat: Infinity,
        repeatDelay: 4.4 // Esperar 4.4s + 0.6s de animación = 5s entre repeticiones
      }
    }
  };

  return (
    <motion.button
      className={styles.propinaButton}
      onClick={navigateToPropinas}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={buttonVariants}
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      whileTap="tap"
      aria-label="Dar propina"
    >
      <motion.div 
        className={styles.iconContainer}
        variants={iconVariants}
        initial="initial"
        animate="animate"
      >
        <PiTipJarBold className={styles.icon} />
      </motion.div>
    </motion.button>
  );
}