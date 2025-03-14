"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './ProductsHome.module.css';
import { menú } from '@/app/fakeData';
import { FaMinus, FaPlus, FaPizzaSlice, FaHamburger, FaCoffee, FaWineGlassAlt, 
        FaGlassMartini, FaCocktail, FaBreadSlice, FaIceCream, FaWineBottle, 
        FaGlassWhiskey, FaUtensils, FaCheese, FaCarrot } from 'react-icons/fa';
import { BiDrink, BiCake } from 'react-icons/bi';
import { GiNoodles, GiCupcake, GiWrappedSweet, GiChocolateBar, GiSodaCan, GiWaterBottle } from 'react-icons/gi';
import { supabase } from '@/config/supabaseClient';
import { useCart } from '@/context/CartContext';
import CategoryCarousel from '../CategoryCarousel/CategoryCarousel';
import { useThemeContext } from '@/context/ThemeSwitchContext';

// Función para obtener el icono según la categoría y nombre del producto
const getProductIcon = (product) => {
    // Primero verificamos por nombre específico
    const productName = product.nombre.toLowerCase();
    
    if (productName.includes('pizza')) return <FaPizzaSlice />;
    if (productName.includes('empanada')) return <FaHamburger />;
    if (productName.includes('cerveza')) return <FaWineBottle />;
    if (productName.includes('vino')) return <FaWineGlassAlt />;
    if (productName.includes('fernet')) return <FaGlassWhiskey />;
    if (productName.includes('agua')) return <GiWaterBottle />;
    if (productName.includes('jugo')) return <BiDrink />;
    if (productName.includes('limonada')) return <BiDrink />;
    if (productName.includes('tostado')) return <FaBreadSlice />;
    if (productName.includes('croissant')) return <FaBreadSlice />;
    if (productName.includes('tarta')) return <FaUtensils />;
    if (productName.includes('medialuna')) return <FaBreadSlice />;
    if (productName.includes('torta')) return <BiCake />;
    if (productName.includes('churro')) return <GiWrappedSweet />;
    if (productName.includes('helado')) return <FaIceCream />;
    if (productName.includes('brownie')) return <GiChocolateBar />;
    if (productName.includes('cheesecake')) return <BiCake />;
    if (productName.includes('ravioles')) return <GiNoodles />;
    if (productName.includes('bife')) return <FaUtensils />;
    if (productName.includes('pechuga')) return <FaUtensils />;
    
    // Si no hay match específico por nombre, buscamos por categoría
    if (!product.categorias) return <FaUtensils />;
    
    const categories = product.categorias.map(cat => cat.toLowerCase());
    
    if (categories.includes('comidas')) return <FaUtensils />;
    if (categories.includes('pizzas')) return <FaPizzaSlice />;
    if (categories.includes('empanadas')) return <FaHamburger />;
    if (categories.includes('menu cena')) return <FaUtensils />;
    if (categories.includes('con alcohol')) return <FaCocktail />;
    if (categories.includes('sin alcohol')) return <BiDrink />;
    if (categories.includes('salado')) return <FaCheese />;
    if (categories.includes('dulce')) return <GiCupcake />;
    if (categories.includes('postres')) return <FaIceCream />;
    if (categories.includes('desayunos y meriendas')) return <FaCoffee />;
    if (categories.includes('bebidas')) return <FaGlassMartini />;
    
    // Icono predeterminado si no hay coincidencia
    return <FaUtensils />;
};

// Componente para mostrar resultados de búsqueda
const SearchResults = ({ results, addToCart, removeFromCart }) => (
    <motion.div className={styles['search-results']} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {results.map((product) => (
            <motion.div key={product.nombre} className={styles['product-card-search']} whileHover={{ scale: 1.05 }}>
                <div className={styles['product-icon']}>
                    {getProductIcon(product)}
                </div>
                <h4 className={styles['product-name']}>{product.nombre}</h4>
                <p className={styles['product-description']}>{product.descripcion}</p>
                <p className={styles['product-price']}>${product.precio}</p>
                <button onClick={() => addToCart(product, 1)} className={styles['add-button']}>Agregar</button>
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
        <div className={styles['product-content']}>
            <div className={styles['product-icon']}>
                {getProductIcon(product)}
            </div>
            <div className={styles['product-details']}>
                <h4 className={styles['product-name']}>{product.nombre}</h4>
                <p className={styles['product-description']}>{product.descripcion}</p>
                <p className={styles['product-price']}>${product.precio}</p>
            </div>
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

    // Resto del código permanece igual...
    const formatForComparison = (name) => {
        if (!name) return '';
        return name.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[áàäâã]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöôõ]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n');
    };

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

    const handleCategorySelect = (category, parentCategory = null) => {
        if (parentCategory) {
            setSelectedCategory(parentCategory);
            setSelectedSubcategory(category);
        } else {
            setSelectedCategory(category);
            setSelectedSubcategory(null);
        }
    };

    const handleQuantityChange = (productId, change) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
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
        removeFromCart(product, product.quantity);
    };

    const filteredMenu = Object.keys(menú.menu).reduce((acc, category) => {
        if (selectedCategory && selectedCategory.nombre) {
            const formattedMenuCategory = formatForComparison(category);
            const formattedSelectedCategory = formatForComparison(selectedCategory.nombre);

            if (formattedMenuCategory !== formattedSelectedCategory) {
                return acc;
            }
        }

        const subcategories = Object.keys(menú.menu[category]).reduce((subAcc, subcategory) => {
            if (selectedSubcategory && selectedSubcategory.nombre) {
                const formattedMenuSubcategory = formatForComparison(subcategory);
                const formattedSelectedSubcategory = formatForComparison(selectedSubcategory.nombre);

                if (formattedMenuSubcategory !== formattedSelectedSubcategory) {
                    return subAcc;
                }
            }

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

    const generateScrollId = (name) => {
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