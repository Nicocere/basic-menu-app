"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { menú } from '@/app/fakeData';
import styles from './CarouselHeader.module.css';

const CarouselHeader = ({ title = "Productos Destacados" }) => {
  const [loading, setLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [domLoaded, setDomLoaded] = useState(false);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  // Extraer productos destacados de fakeData
  useEffect(() => {
    try {
      // Extraemos productos de fakeData para mostrarlos en el carousel
      const allProducts = [];
      
      // Recorremos la estructura de fakeData para extraer productos
      Object.keys(menú.menu).forEach(category => {
        // Verificar si es un array o un objeto
        if (Array.isArray(menú.menu[category])) {
          const productsWithCategories = menú.menu[category].map(product => ({
            ...product,
            category
          }));
          allProducts.push(...productsWithCategories);
        } else {
          Object.keys(menú.menu[category]).forEach(subcategory => {
            const products = menú.menu[category][subcategory];
            if (Array.isArray(products)) {
              // Añadimos categoría y subcategoría a cada producto
              const productsWithCategories = products.map(product => ({
                ...product,
                category,
                subcategory
              }));
              allProducts.push(...productsWithCategories);
            }
          });
        }
      });
      
      // Seleccionamos algunos productos aleatorios para destacar
      const randomItems = [...allProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
        
      setFeaturedItems(randomItems);
    } catch (error) {
      console.error("Error procesando datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Para evitar problemas de hidratación con SSR
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (loading) {
    return (
      <div className={styles.carouselContainer}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  if (!featuredItems || featuredItems.length === 0) {
    return (
      <div className={styles.carouselContainer}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.noItems}>
          No hay elementos destacados disponibles
        </div>
      </div>
    );
  }

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.title}>{title}</h2>
      
      {domLoaded && (
        <div className={styles.swiperWrapper}>
          <div ref={navigationPrevRef} className={styles.prevButton} aria-label="Anterior">
            <FaChevronLeft className={styles.buttonIcon} />
          </div>
          
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={16}
            slidesPerView="auto"
            centeredSlides={false}
            loop={featuredItems.length > 3}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 12 },
              480: { slidesPerView: 1.5, spaceBetween: 16 },
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 3.5, spaceBetween: 24 },
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }}
            className={styles.swiperContainer}
          >
            {featuredItems.map((item, index) => (
              <SwiperSlide key={`${item.nombre}-${index}`} className={styles.slide}>
                <div className={styles.itemCard}>
                  <div className={styles.tagContainer}>
                    <span className={styles.tag}>Destacado</span>
                  </div>
                  <div className={styles.imageContainer}>
                    <img
                      src={"/fakeProduct.jpg"}
                      alt={item.nombre}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.nombre}</h3>
                    <p className={styles.itemDescription}>
                      {item.descripcion?.substring(0, 60) || `${item.category} - ${item.subcategory || ''}`}
                      {item.descripcion?.length > 60 ? "..." : ""}
                    </p>
                    <div className={styles.itemPrice}>${item.precio}</div>
                  </div>
                </div>
              </SwiperSlide>
            )
            
            )}
          </Swiper>
          
          <div ref={navigationNextRef} className={styles.nextButton} aria-label="Siguiente">
            <FaChevronRight className={styles.buttonIcon} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselHeader;