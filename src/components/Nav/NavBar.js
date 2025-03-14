"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './navBar.module.css';
import { 
  FaBars, 
  FaMoon,
  FaSun,
  FaGlobe,
  FaTimes,
  FaHome,
  FaUtensils,
  FaInfoCircle,
  FaEnvelope
} from 'react-icons/fa';
import { useThemeContext } from '@/context/ThemeSwitchContext';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('ES');
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const { isDarkMode, handleThemeChange } = useThemeContext();

  // Detectar scroll para cambiar apariencia del header
  // Detectar scroll para cambiar apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      // Cambiar de forma basada en el scroll
      // Cuando scrollY > 20, el navbar tendrá border-radius y otros efectos
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleLanguage = () => setLanguage(language === 'ES' ? 'EN' : 'ES');
  const navigateTo = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  const menuItems = [
    { name: 'Inicio', icon: <FaHome />, path: '/' },
    { name: 'Menú', icon: <FaUtensils />, path: '/menu' },
    // { name: 'Nosotros', icon: <FaInfoCircle />, path: '/about' },
    { name: 'Contacto', icon: <FaEnvelope />, path: '#contact' }
  ];

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.headerContent}>
          <button 
            className={styles.menuButton} 
            onClick={toggleSidebar}
            aria-label="Menú principal"
          >
            <FaBars />
          </button>
          
          <div 
            className={styles.logoContainer} 
            onClick={() => navigateTo('/')}
            role="button"
            tabIndex={0}
            aria-label="Ir a inicio"
            onKeyDown={(e) => e.key === 'Enter' && navigateTo('/')}
          >
            <h1 className={styles.headerTitle}>Bar & Grill</h1>
            <h3 className={styles.headerSubtitle}>Since 2002</h3>
          </div>
          
          <div className={styles.headerIcons}>
            <button 
              onClick={handleThemeChange}
              className={styles.iconButton}
              aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay para cerrar al hacer clic fuera */}
            <motion.div 
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
            
            {/* Sidebar con animación */}
            <motion.nav 
              className={styles.sidebar}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarTitle}>
                  {language === 'ES' ? 'Menú' : 'Menu'}
                </h2>
                <button 
                  className={styles.closeButton} 
                  onClick={toggleSidebar}
                  aria-label="Cerrar menú"
                >
                  <FaTimes />
                </button>
              </div>
              
              <ul className={styles.navList}>
                {menuItems.map((item) => (
                  <motion.li 
                    key={item.name}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <button 
                      className={styles.navItem} 
                      onClick={() => navigateTo(item.path)}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navText}>
                        {language === 'ES' ? item.name : item.name}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}