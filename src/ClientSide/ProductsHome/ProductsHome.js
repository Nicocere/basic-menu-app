"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './ProductsHome.module.css';
import { menú } from '@/app/fakeData';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { supabase } from '@/config/supabaseClient';
import { useCart } from '@/context/CartContext';
import CategoryCarousel from '../CategoryCarousel/CategoryCarousel';
import { useThemeContext } from '@/context/ThemeSwitchContext';

// Componente para mostrar resultados de búsqueda
const SearchResults = ({ results, addToCart, removeFromCart }) => (
    <motion.div className={styles['search-results']} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {results.map((product) => (
            <motion.div key={product.nombre} className={styles['product-card']} whileHover={{ scale: 1.05 }}>
                <img
                    src="/fakeProduct.jpg"
                    alt={product.nombre}
                    className={styles['product-image']}
                />
                <h4 className={styles['product-name']}>{product.nombre}</h4>
                <p className={styles['product-description']}>{product.descripcion}</p>
                <p className={styles['product-price']}>${product.precio}</p>
                <button onClick={() => addToCart(product, 1)} className={styles['add-button']}>Agregar</button>
                <button onClick={() => removeFromCart(product)} className={styles['remove-button']}>Eliminar</button>
            </motion.div>
        ))}
    </motion.div>
);

// Componente para mostrar una tarjeta de producto
const ProductCard = ({ product, quantity, onQuantityChange, onAddToCart }) => (
    <motion.div
        className={styles['product-card']}
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <div className={styles['product-image-container']}>
            <img
                src="/fakeProduct.jpg"
                alt={product.nombre}
                className={styles['product-image']}
            />
            <h4 className={styles['product-name']}>{product.nombre}</h4>
            <p className={styles['product-description']}>{product.descripcion}</p>
            <p className={styles['product-price']}>${product.precio}</p>
        </div>

        <div className={styles['product-buttons']}>
            <div className={styles.quantityControl}>
                <button
                    onClick={() => onQuantityChange(product.nombre, -1)}
                    className={styles.quantityButton}
                >
                    <FaMinus />
                </button>
                <span className={styles.quantity}>{quantity || 1}</span>
                <button
                    onClick={() => onQuantityChange(product.nombre, 1)}
                    className={styles.quantityButton}
                >
                    <FaPlus />
                </button>
            </div>
            <button
                onClick={() => onAddToCart(product)}
                className={styles['add-button']}
            >
                Agregar
            </button>
        </div>
    </motion.div>
);

export default function ProductsHome() {
    // Estados locales
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [productos, setProductos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const { isDarkMode } = useThemeContext();

    // Usar el contexto del carrito
    const { cart, addToCart, removeFromCart } = useCart();

    // Función para normalizar los nombres de categorías para comparación
    const formatForComparison = (name) => {
        // Si name no existe, devolver cadena vacía
        if (!name) return '';

        // Transformar formato bonito a formato de base de datos
        return name.toLowerCase()
            .replace(/\s+/g, '_')     // Espacios a guiones bajos
            .replace(/[áàäâã]/g, 'a')  // Normalizar acentos
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöôõ]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n');
    };

    // Cargar productos desde Supabase
    useEffect(() => {
        const fetchProductos = async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*');

            if (error) {
                console.error('Error fetching productos:', error);
            } else {
                setProductos(data);
            }
        };

        fetchProductos();
    }, []);

    // Manejador para cuando se selecciona una categoría
    const handleCategorySelect = (category, parentCategory = null) => {
        console.log("Categoría seleccionada:", category);
        console.log("Categoría padre:", parentCategory);

        if (parentCategory) {
            // Es una subcategoría
            setSelectedCategory(parentCategory);
            setSelectedSubcategory(category);
        } else {
            // Es una categoría principal
            setSelectedCategory(category);
            setSelectedSubcategory(null);
        }
    };

    // Manejadores de eventos
    const handleQuantityChange = (productId, change) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        // Limpiar categoría seleccionada cuando se busca
        if (event.target.value) {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
        }
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.nombre] || 1;
        addToCart(product, quantity);
    };

    const handleRemoveFromCart = (product) => {
        removeFromCart(product, product.quantity); // Eliminar todas las unidades
    };

    // Filtrar menú basado en búsqueda Y categoría seleccionada
    const filteredMenu = Object.keys(menú.menu).reduce((acc, category) => {
        // Si hay una categoría seleccionada y no es esta, la saltamos
        if (selectedCategory && selectedCategory.nombre) {
            const formattedMenuCategory = formatForComparison(category);
            const formattedSelectedCategory = formatForComparison(selectedCategory.nombre);

            if (formattedMenuCategory !== formattedSelectedCategory) {
                return acc;
            }
        }

        const subcategories = Object.keys(menú.menu[category]).reduce((subAcc, subcategory) => {
            // Si hay una subcategoría seleccionada y no es esta, la saltamos
            if (selectedSubcategory && selectedSubcategory.nombre) {
                const formattedMenuSubcategory = formatForComparison(subcategory);
                const formattedSelectedSubcategory = formatForComparison(selectedSubcategory.nombre);

                if (formattedMenuSubcategory !== formattedSelectedSubcategory) {
                    return subAcc;
                }
            }

            // Filtrar productos que coincidan con el término de búsqueda
            const products = Array.isArray(menú.menu[category][subcategory])
                ? menú.menu[category][subcategory].filter((product) =>
                    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : [];

            if (products.length > 0) {
                subAcc[subcategory] = products;
            }
            return subAcc;
        }, {});

        if (Object.keys(subcategories).length > 0) {
            acc[category] = subcategories;
        }
        return acc;
    }, {});


    const searchResults = Object.values(filteredMenu).flatMap((subcategories) =>
        Object.values(subcategories).flat()
    );

    // Para depuración - muestra en consola qué categorías se están filtrando
    useEffect(() => {
        console.log("Menú filtrado:", filteredMenu);
        console.log("Categoría seleccionada:", selectedCategory);
        console.log("Subcategoría seleccionada:", selectedSubcategory);
    }, [filteredMenu, selectedCategory, selectedSubcategory]);

    // Animación para secciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Función para generar IDs compatibles con scroll
    const generateScrollId = (name) => {
        // Convertir de formato "sin_alcohol" a "sin-alcohol" para IDs HTML
        return name.toLowerCase()
            .replace(/_+/g, '-')
            .replace(/\s+/g, '-');
    };


    return (
        <main className={`${styles.main} ${isDarkMode ? styles.darkMode : ''}`}>

            <div className={styles.menu}>
                <header className={styles.header}>
                    <h2 className={styles.mainTitle}>Buscar Productos</h2>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className={styles.searchInput}
                    />
                    {searchTerm.length > 0 && (
                        <SearchResults
                            results={searchResults}
                            addToCart={handleAddToCart}
                            removeFromCart={handleRemoveFromCart}
                        />
                    )}
                </header>

                <h2 className={styles.mainTitle}>Categorías</h2>
                <CategoryCarousel onCategorySelect={handleCategorySelect} />

                {/* Mostrar qué categoría está seleccionada */}
                {selectedCategory && (
                    <div className={styles.filterInfo}>
                        Mostrando productos de: <strong>{selectedCategory.nombre}</strong>
                        {selectedSubcategory && (
                            <> &gt; <strong>{selectedSubcategory.nombre}</strong></>
                        )}
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setSelectedSubcategory(null);
                            }}
                            className={styles.clearFilter}
                        >
                            Mostrar todo
                        </button>
                    </div>
                )}

                {/* Mostrar mensaje si no hay productos */}
                {Object.keys(filteredMenu).length === 0 && (
                    <div className={styles.noProducts}>
                        <p>No se encontraron productos
                            {selectedCategory ? ` en la categoría "${selectedCategory.nombre}"` : ""}.
                        </p>
                    </div>
                )}


                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {Object.keys(filteredMenu).map((category) => {
                        const categoryId = generateScrollId(category);

                        return (
                            <motion.div
                                key={category}
                                className={styles.category}
                                variants={itemVariants}
                                id={`category-${categoryId}`}
                            >
                                <h2 className={styles['category-title']}>{category.replace(/_/g, ' ')}</h2>

                                {Object.keys(filteredMenu[category]).map((subcategory) => {
                                    const subcategoryId = generateScrollId(subcategory);

                                    return (
                                        <div
                                            key={subcategory}
                                            className={styles.subcategory}
                                            id={`subcategory-${categoryId}-${subcategoryId}`}
                                        >
                                            <h3 className={styles['subcategory-title']}>
                                                {subcategory.replace(/_/g, ' ')}
                                            </h3>

                                            <div className={styles['product-list']}>
                                                {filteredMenu[category][subcategory].map((product) => (
                                                    <ProductCard
                                                        key={product.nombre}
                                                        product={product}
                                                        quantity={quantities[product.nombre] || 1}
                                                        onQuantityChange={handleQuantityChange}
                                                        onAddToCart={handleAddToCart}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </main>
    );
}