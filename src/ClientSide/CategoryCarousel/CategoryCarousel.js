"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './CategoryCarousel.module.css';
import { useThemeContext } from '@/context/ThemeSwitchContext';

const CategoryCarousel = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const { isDarkMode } = useThemeContext();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categorias')
          .select('*')
          .order('nombre');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categorias:', error);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const { data, error } = await supabase
          .from('subcategorias')
          .select('*')
          .eq('categoria_id', selectedCategory.id)
          .order('nombre');
        
        if (error) throw error;
        setSubcategories(data || []);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setError('Failed to load subcategories');
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  const scrollToCategory = (categoryId) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Dejamos un pequeño margen para que se vea el título de la categoría
      const offset = 80; 
      const elementPosition = element.getBoundingClientRect().top;
      // Usamos window.scrollY en lugar de window.pageYOffset (que está deprecated)
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSubcategory = (categoryId, subcategoryId) => {
    const element = document.getElementById(`subcategory-${categoryId}-${subcategoryId}`);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      // Usamos window.scrollY en lugar de window.pageYOffset (que está deprecated)
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (category) => {
    // Si hacemos clic en la categoría que ya está seleccionada, la deseleccionamos
    if (selectedCategory && selectedCategory.id === category.id) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      
      if (onCategorySelect) {
        onCategorySelect(null);
      }
      return;
    }

    // De lo contrario, seleccionamos la nueva categoría
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Reiniciamos la subcategoría seleccionada
    
    // Scroll a la categoría seleccionada
    scrollToCategory(category.id);
    
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    // Si hacemos clic en la subcategoría que ya está seleccionada, la deseleccionamos
    if (selectedSubcategory && selectedSubcategory.id === subcategory.id) {
      setSelectedSubcategory(null);
      
      if (onCategorySelect && selectedCategory) {
        onCategorySelect(selectedCategory); // Volvemos a mostrar solo la categoría
      }
      return;
    }

    setSelectedSubcategory(subcategory);
    if (selectedCategory && onCategorySelect) {
      // Scroll a la subcategoría seleccionada
      scrollToSubcategory(selectedCategory.id, subcategory.id);
      onCategorySelect(subcategory, selectedCategory);
    }
  };

  // Reemplazar los returns de estados
  if (loading) return <div className={styles.loadingSpinner}>Cargando categorías...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (categories.length === 0) return <div className={styles.noCategories}>No se encontraron categorías</div>;

  return (
    <div className={`${styles.categoryCarouselContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      <h2 className={styles.title}>Categorías</h2>
      
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={5}
        slidesPerView={2}
        navigation={false}
        className={styles.swiperContainer}
        breakpoints={{
          320: { slidesPerView: 2.3, spaceBetween: 5 },
          480: { slidesPerView: 3, spaceBetween: 5 },
          768: { slidesPerView: 4, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 30 },
        }}
      >
        {categories.map((category) => {          
          return(
          <SwiperSlide key={category.id} style={{width:'min-content !important'}}>
            <div 
              className={`${styles.categoryItem} ${
                selectedCategory?.id === category.id ? styles.selected : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <span className={styles.categoryName}>{category.nombre}</span>
            </div>
          </SwiperSlide>
        )})}
      </Swiper>

      {selectedCategory && subcategories.length > 0 && (
        <div className={styles.subcategoriesContainer}>
          <h3 className={styles.subtitle}>
            Subcategorías de {selectedCategory.nombre}
          </h3>
          
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            className={styles.swiperContainer}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              480: { slidesPerView: 3, spaceBetween: 10 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 30 },
            }}
          >
            {subcategories.map((subcategory) => (
              <SwiperSlide key={subcategory.id}>
                <div 
                  className={`${styles.subcategoryItem} ${
                    selectedSubcategory?.id === subcategory.id ? styles.selected : ''
                  }`}
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  <span className={styles.subcategoryName}>
                    {subcategory.nombre || subcategory.name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;