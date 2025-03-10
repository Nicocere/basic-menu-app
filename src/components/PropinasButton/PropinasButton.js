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
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)"
    },
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: ["0px 4px 8px rgba(0, 0, 0, 0.15)", "0px 8px 16px rgba(0, 0, 0, 0.2)", "0px 4px 8px rgba(0, 0, 0, 0.15)"],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }
    },
    hover: {
      scale: 1.1,
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
    }
  };

  // Variantes para el texto
  const textVariants = {
    hidden: { opacity: 0, y: 20, width: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      width: "auto",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
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
      animate={isHovered ? "hover" : "pulse"}
      whileTap="tap"
      aria-label="Dar propina"
    >
        <motion.div 
        className={styles.iconContainer}    
        initial={{x: 0 }}
        animate={{ x: 5 }}
        whileTap="tap"
        >
      <PiTipJarBold className={styles.icon} />
      
        </motion.div>   


      <motion.span 
        className={styles.buttonText}
        variants={textVariants}
        initial="hidden"
        animate={isHovered ? "visible" : "hidden"}
      >
        Propina
      </motion.span>
    </motion.button>
  );
}