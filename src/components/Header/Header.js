"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { FaMapMarkerAlt, FaClock, FaPhone, FaChevronDown, FaShoppingCart } from 'react-icons/fa';
import { useThemeContext } from '@/context/ThemeSwitchContext';

const Header = ({

  restaurantName = "Bar & Grill",
  tagline = "Cuisine & Craft",
  address = "Av. Libertador 1234, Buenos Aires",
  hours = "18:00 - 01:00, Martes a Domingo",
  phone = "+54 11 4567-8900",
  cta = "Ordenar",
  ctaLink = "/menu",
  bannerSrc = "/banner.jpg"
}) => {
  const { isDarkMode } = useThemeContext();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position * 0.5);
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
            <div className={styles.brandContainer}>
              <h1 className={styles.restaurantName}>{restaurantName}</h1>
              <div className={styles.taglineWrapper}>
                <span className={styles.taglineLine}></span>
                <p className={styles.tagline}>{tagline}</p>
                <span className={styles.taglineLine}></span>
              </div>
            </div>
            
            <div className={styles.ctaContainer}>
              <Link href={ctaLink} className={styles.ctaButton}>
                <FaShoppingCart className={styles.ctaIcon} />
                <span>{cta}</span>
              </Link>
            </div>
          </div>
          
          <div className={styles.headerBottom}>
            <div className={styles.infoContainer}>
              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <FaMapMarkerAlt className={styles.infoIcon} aria-hidden="true" />
                </div>
                <span>{address}</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <FaClock className={styles.infoIcon} aria-hidden="true" />
                </div>
                <span>{hours}</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <FaPhone className={styles.infoIcon} aria-hidden="true" />
                </div>
                <span>{phone}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <span>Descubre nuestro menú</span>
          <div className={styles.scrollIconContainer}>
            <FaChevronDown className={styles.scrollIcon} />
          </div>
        </div>
      </div>
      
      <div className={styles.headerShape}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path className={styles.wavePath1} d="M0,32L60,42.7C120,53,240,75,360,69.3C480,64,600,32,720,32C840,32,960,64,1080,69.3C1200,75,1320,53,1380,42.7L1440,32L1440,120L0,120Z"></path>
          <path className={styles.wavePath2} d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,53.3C1200,53,1320,43,1380,37.3L1440,32L1440,120L0,120Z"></path>
        </svg>
      </div>
    </header>
  );
};

export default Header;