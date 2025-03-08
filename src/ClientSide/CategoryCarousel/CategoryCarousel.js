import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './CategoryCarousel.module.css';

const CategoryCarousel = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

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

  const handleCategoryClick = (category) => {
	setSelectedCategory(category);
	if (onCategorySelect) {
	  onCategorySelect(category);
	}
  };

  const handleSubcategoryClick = (subcategory) => {
	if (onCategorySelect) {
	  onCategorySelect(subcategory, selectedCategory);
	}
  };

  console.log(categories, selectedCategory, subcategories);

// Reemplazar los returns de estados
if (loading) return <div className={styles.loadingSpinner}>Cargando categorias...</div>;
if (error) return <div className={styles.errorMessage}>{error}</div>;
if (categories.length === 0) return <div className={styles.noCategories}>No se encontraron categorias</div>;

  return (
    <div className={styles.categoryCarouselContainer}>
    <h2 className={styles.title}>Categorias</h2>
    
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={5}
      slidesPerView={2}
      navigation={false}
    //   pagination={{ clickable: true }}
      className={styles.swiperContainer}
      breakpoints={{
        320: { slidesPerView: 3, spaceBetween: 5 },
        480: { slidesPerView: 3, spaceBetween: 5 },
        768: { slidesPerView: 4, spaceBetween: 20 },
        1024: { slidesPerView: 5, spaceBetween: 30 },
      }}
    >
      {categories.map((category) => (
        <SwiperSlide key={category.id} style={{width:'min-content !important'}}>
          <div 
            className={`${styles.categoryItem} ${
              selectedCategory?.id === category.id ? styles.selected : ''
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.image_url && (
              <img 
                src={category.image_url} 
                alt={category.name} 
                className={styles.categoryImage} 
              />
            )}
            <span className={styles.categoryName}>{category.nombre}</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>

    {selectedCategory && subcategories.length > 0 && (
      <div className={styles.subcategoriesContainer}>
        <h3 className={styles.subtitle}>
          Subcategorias de {selectedCategory.nombre}
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
                className={styles.subcategoryItem}
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                {subcategory.image_url && (
                  <img 
                    src={subcategory.image_url} 
                    alt={subcategory.name} 
                    className={styles.subcategoryImage} 
                  />
                )}
                <span className={styles.subcategoryName}>
                  {subcategory.name}
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
