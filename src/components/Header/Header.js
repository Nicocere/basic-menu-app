"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { FaMapMarkerAlt, FaClock, FaPhone, FaChevronDown } from 'react-icons/fa';
import { useThemeContext } from '@/context/ThemeSwitchContext';

const Header = ({
  restaurantName = "Delicias Gourmet",
  tagline = "Sabores que inspiran cada día",
  address = "Av. Libertador 1234, Buenos Aires",
  hours = "12:00 - 23:00, todos los días",
  phone = "+54 11 4567-8900",
  cta = "Reservar Mesa",
  ctaLink = "/reservas",
  bannerSrc = "/banner.jpg"
}) => {
  const { isDarkMode } = useThemeContext();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const headerRef = useRef(null);

  // Efecto para animación de entrada
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Efecto para detección de scroll y efecto parallax
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position * 0.5); // Valor para efecto parallax
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`
        ${styles.header} 
        ${isDarkMode ? styles.darkMode : ''} 
        ${isVisible ? styles.visible : ''}
      `}
    >
      <div className={styles.bannerContainer}>
        <div 
          className={styles.bannerImage} 
          style={{
            backgroundImage: `url(${bannerSrc})`,
            transform: `translateY(${scrollPosition}px)`,
          }}
        ></div>
        <div className={styles.bannerOverlay}></div>
      </div>
      
      <div className={styles.headerContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.headerTop}>
            <h1 className={styles.restaurantName}>{restaurantName}</h1>
            <p className={styles.tagline}>{tagline}</p>
            
            <div className={styles.ctaContainer}>
              <Link href={ctaLink} className={styles.ctaButton}>
                {cta}
              </Link>
            </div>
          </div>
          
          <div className={styles.headerBottom}>
            <div className={styles.infoContainer}>
              <div className={styles.infoItem}>
                <FaMapMarkerAlt className={styles.infoIcon} aria-hidden="true" />
                <span>{address}</span>
              </div>
              <div className={styles.infoItem}>
                <FaClock className={styles.infoIcon} aria-hidden="true" />
                <span>{hours}</span>
              </div>
              <div className={styles.infoItem}>
                <FaPhone className={styles.infoIcon} aria-hidden="true" />
                <span>{phone}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <span>Descubre nuestro menú</span>
          <FaChevronDown className={styles.scrollIcon} />
        </div>
      </div>
      
      <div className={styles.headerShape}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,55,960,55C1120,55,1280,53,1360,52L1440,51L1440,80L0,80Z"></path>
        </svg>
      </div>
    </header>
  );
};

export default Header;