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

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('ES');

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
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
          <button onClick={toggleTheme} className={styles.iconButton}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={toggleLanguage} className={styles.iconButton}>
            <FaGlobe />
            <span>{language}</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.sidebar}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button className={styles.closeButton} onClick={toggleSidebar}>
              <FaTimes />
            </button>

            <div className={styles.sidebarContent}>
              <nav className={styles.navigation}>
                <h3 className={styles.navTitle}>Menú</h3>
                {categories.map((category) => (
                  <Link 
                    href={`#${category.toLowerCase()}`} 
                    key={category}
                    className={styles.navLink}
                    onClick={toggleSidebar}
                  >
                    {category}
                  </Link>
                ))}
              </nav>

              <div className={styles.quickAccess}>
                <Link href="/cart" className={styles.cartButton}>
                  <FaShoppingCart />
                  <span>Ver Carrito</span>
                </Link>
              </div>

              <div className={styles.socialLinks}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a href="https://wa.me/yourphone" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp />
                </a>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                  <FaMapMarkerAlt />
                </a>
              </div>

              <div className={styles.restaurantInfo}>
                <h4>Horarios</h4>
                <p>Lun a Dom: 12:00 - 00:00</p>
                <h4>Ubicación</h4>
                <p>Av. del Libertador 8888, Nuñez</p>
                <h4>Reservas</h4>
                <p>+54 911 4447 8490</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}