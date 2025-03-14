"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './footer.module.css';
import { 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaClock, 
  FaInstagram, 
  FaFacebook, 
  FaPhone,
  FaEnvelope,
  FaCalendarAlt
} from 'react-icons/fa';
import { useThemeContext } from '@/context/ThemeSwitchContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const logo = "https://firebasestorage.googleapis.com/v0/b/empativa-psicologia.appspot.com/o/develops%2Fspazio-logo-dark.png?alt=media&token=cb764ca3-75fd-4796-9eef-8eea5bfc8b0c";
  const { isDarkMode } = useThemeContext();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5491144478490', '_blank');
  };

  const handleMapClick = () => {
    window.open('https://goo.gl/maps/yourLocation', '_blank');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Aquí iría la lógica para suscribir realmente
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className={`${styles.footer} ${isDarkMode ? styles.darkMode : ''}`} id="contact">
      <motion.div 
        className={styles.footerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerAnimation}
      >
        <motion.div 
          className={`${styles.footerSection} ${styles.contact}`}
          variants={itemAnimation}
        >
          <h3 className={styles.sectionTitle}>Contacto</h3>
          <motion.div 
            className={styles.contactItem} 
            onClick={handleWhatsAppClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaWhatsapp className={styles.icon} />
            <div className={styles.contactInfo}>
              <p className={styles.text}>Pedidos por WhatsApp</p>
              <p className={styles.highlight}>+54 911 4447 8490</p>
            </div>
          </motion.div>
          <motion.div 
            className={styles.contactItem} 
            onClick={handleMapClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaMapMarkerAlt className={styles.icon} />
            <div className={styles.contactInfo}>
              <p className={styles.text}>Av. del Libertador 8888</p>
              <p className={styles.text}>Nuñez, CABA</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className={`${styles.footerSection} ${styles.hours}`}
          variants={itemAnimation}
        >
          <h3 className={styles.sectionTitle}>Horarios</h3>
          <div className={styles.scheduleItem}>
            <FaClock className={styles.icon} />
            <div>
              <p className={styles.text}>Abierto todos los días</p>
              <p className={styles.highlight}>8:00 AM - 2:00 AM</p>
            </div>
          </div>
          <motion.button 
            className={styles.reserveButton} 
            onClick={handleWhatsAppClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaCalendarAlt className={styles.buttonIcon} />
            Pide ahora para retirar después
          </motion.button>
        </motion.div>

        <motion.div 
          className={`${styles.footerSection} ${styles.social}`}
          variants={itemAnimation}
        >
          <h3 className={styles.sectionTitle}>Seguinos</h3>
          <div className={styles.socialLinks}>
            <motion.a 
              href="#" 
              className={styles.socialIcon}
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a 
              href="#" 
              className={styles.socialIcon}
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFacebook />
            </motion.a>
            <motion.a 
              href="#" 
              className={styles.socialIcon}
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      <div className={styles.footerBottom}>
                <div className={styles.legalSection}>
                    <p className={styles.copyright}>
                        Bar App © {new Date().getFullYear()}
                    </p>
                    <p className={styles.credits}>
                        Desarrollado por 
                        <motion.span 
                            whileHover={{ color: "#6b6b6b" }}
                            transition={{ duration: 0.3 }}
                        >
                            <a 
                                href="https://spaziodigitalsolutions.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Spazio Digital Solutions
                            </a>
                        </motion.span>
                    </p>
                </div>
                
                <motion.div 
                    className={styles.logoSection}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link href={'https://spaziodigitalsolutions.com'}>
                        <Image 
                            src={logo} 
                            alt="Spazio Digital Solutions" 
                            width={120} 
                            height={30} 
                            className={styles.logo}
                        />
                    </Link>
                </motion.div>
            </div>
    </footer>
  );
}