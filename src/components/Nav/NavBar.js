"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './navBar.module.css';
import { 
  FaBars, 
  FaTimes, 
  FaShoppingCart, 
  FaInstagram, 
  FaWhatsapp,
  FaMapMarkerAlt,
  FaMoon,
  FaSun,
  FaGlobe
} from 'react-icons/fa';
import { useThemeContext } from '@/context/ThemeSwitchContext';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('ES');

  const { isDarkMode, handleThemeChange } = useThemeContext();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleLanguage = () => setLanguage(language === 'ES' ? 'EN' : 'ES');

  const categories = [
    'Entradas',
    'Platos Principales',
    'Postres',
    'Bebidas',
    'Vinos'
  ];

  return (
    <>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className={styles.container}>
          <h1 className={styles['header-title']}>ANTONIO</h1>
          <h3 className={styles['header-subtitle']}>resto</h3>
        </div>
        <div className={styles.headerIcons}>
          <button 
            onClick={handleThemeChange}
            className={styles.themeToggle}
            aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={toggleLanguage} className={styles.iconButton}>
            <FaGlobe />
            <span>{language}</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {/* ...resto del código existente... */}
      </AnimatePresence>
    </>
  );
}