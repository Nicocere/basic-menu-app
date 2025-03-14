"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import style from './CartMoreProducts.module.css';
import { useThemeContext } from '@/context/ThemeSwitchContext';
import { FaPizzaSlice, FaHamburger, FaCoffee, FaWineGlassAlt, 
         FaGlassMartini, FaCocktail, FaBreadSlice, FaIceCream, 
         FaWineBottle, FaGlassWhiskey, FaUtensils, FaCheese, 
         FaCarrot } from 'react-icons/fa';
import { BiDrink, BiCake } from 'react-icons/bi';
import { GiNoodles, GiCupcake, GiWrappedSweet, GiChocolateBar, 
         GiSodaCan, GiWaterBottle } from 'react-icons/gi';
import Swal from 'sweetalert2';
import { menú } from '@/app/fakeData';
import { useMediaQuery } from '@mui/material';

// Función para obtener el icono según la categoría y nombre del producto
const getProductIcon = (product) => {
    // Primero verificamos por nombre específico
    const productName = product.nombre?.toLowerCase() || '';
    
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

const CartMoreProducts = () => {
    // Validación y destructuración segura de todos los contextos
    const { isDarkMode } = useThemeContext();
    const isMobileScreen = useMediaQuery('(max-width: 768px)');

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showOptions, setShowOptions] = useState(false);

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const isInView = useInView(titleRef, { once: false, amount: 0.5 });
    const isSubtitleInView = useInView(subtitleRef, { once: false, amount: 0.5 });

    // Extraer y formatear productos de fakeData.js
    useEffect(() => {
        const extractProducts = () => {
            // Extraer todos los productos de las diferentes categorías
            const allProducts = [
                ...extractFromCategory(menú.menu.comidas),
                ...extractFromCategory(menú.menu.bebidas),
                ...extractFromCategory(menú.menu.desayunos_y_meriendas),
                ...menú.menu.postres
            ];
            
            // Barajar y seleccionar 8 productos aleatorios
            const shuffledProducts = shuffleArray(allProducts);
            const selectedProducts = shuffledProducts.slice(0, 8);
            
            // Agregar opciones de tamaño/variantes simuladas
            const productsWithOptions = selectedProducts.map(product => ({
                ...product,
                id: Math.random().toString(36).substring(2, 9),
                nombre: product.nombre,
                descr: product.descripcion,
                categorias: product.categorias || [],
                opciones: [
                    {
                        id: Math.random().toString(36).substring(2, 9),
                        nombre: "Regular",
                        precio: product.precio,
                        size: "Regular"
                    },
                    {
                        id: Math.random().toString(36).substring(2, 9),
                        nombre: "Grande",
                        precio: Math.floor(product.precio * 1.3),
                        size: "Grande"
                    }
                ]
            }));
            
            setProducts(productsWithOptions);
        };
        
        extractProducts();
    }, []);
    
    // Función para extraer productos de una categoría anidada
    const extractFromCategory = (category) => {
        let categoryProducts = [];
        
        // Si la categoría es un objeto con subcategorías
        if (typeof category === 'object' && !Array.isArray(category)) {
            Object.values(category).forEach(subcategory => {
                if (Array.isArray(subcategory)) {
                    categoryProducts = [...categoryProducts, ...subcategory];
                } else {
                    categoryProducts = [...categoryProducts, ...extractFromCategory(subcategory)];
                }
            });
        }
        // Si es un array de productos
        else if (Array.isArray(category)) {
            categoryProducts = [...category];
        }
        
        return categoryProducts;
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const addToCart = async (product, selectedOption) => {
        try {
            // Usar localStorage en vez de localforage para simplificar
            const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
            
            const existingProductIndex = cartData.findIndex(p => 
                p.nombre === product.nombre && p.size === selectedOption.nombre
            );

            if (existingProductIndex !== -1) {
                cartData[existingProductIndex].quantity += 1;
            } else {
                const newProduct = {
                    nombre: product.nombre,
                    descripcion: product.descr,
                    precio: selectedOption.precio,
                    size: selectedOption.nombre,
                    quantity: 1,
                    categorias: product.categorias
                };
                cartData.push(newProduct);
            }

            localStorage.setItem('cart', JSON.stringify(cartData));

            Swal.fire({
                toast: true,
                title: `<strong style="font-weight: bold;">Producto Agregado</strong>`,
                html: `<span style="font-weight: bold;">${product.nombre} (${selectedOption.nombre}) - $${selectedOption.precio}</span>`,
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                position: 'bottom-end',
                background: isDarkMode ? '#1a1a1a' : 'linear-gradient(180deg,#dbdbdb,#fcf5f0)',
                iconColor: '#ff4757',
            });

            setShowOptions(false);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex >= products.length - 3 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - 3 : prevIndex - 1
        );
    };

    return (
        <motion.div className={`${style.container} ${isDarkMode ? style.dark : style.light}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                ref={titleRef}
                className={style.titleContainer}
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.7, delay: 0.5 }}
            >
                <motion.h2
                    className={style.title}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {isInView && "¿Quieres añadir algo más?".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.03,
                                type: "spring"
                            }}
                            style={{ display: "inline-block" }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.h2>

                <motion.h4
                    ref={subtitleRef}
                    className={style.subtitle}
                    style={{ maxWidth:'40ch', placeSelf:'center', textAlign:'center' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isSubtitleInView ? 
                        { opacity: 1, x: 0 } : 
                        { opacity: 0, x: -20 }
                    }
                    transition={{
                        duration: 0.7,
                        delay: 0.5
                    }}
                >
                    Completa tu experiencia con nuestros productos adicionales
                </motion.h4>
            </motion.div>

            <div className={style.carousel}>
                <button className={style.navButton} onClick={handlePrev}>←</button>

                <div className={style.carouselTrack}>
                    <AnimatePresence mode='sync'>
                        {products.slice(currentIndex, currentIndex + (isMobileScreen ? 1.5 : 3.5)).map((product, idx) => (
                            <motion.div
                                key={product.id || idx}
                                className={style.productCard}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setShowOptions(true);
                                }}
                            >
                                <div className={style.productIconContainer}>
                                    {getProductIcon(product)}
                                </div>
                                <div className={style.productInfo}>
                                    <h3>{product.nombre}</h3>
                                    <p>{product.descr}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <button className={style.navButton} onClick={handleNext}>→</button>
            </div>

            <AnimatePresence mode='sync'>
                {showOptions && selectedProduct && (
                    <motion.div
                        className={style.optionsModal}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className={style.modalContent}>
                            <button
                                className={style.closeButton}
                                onClick={() => setShowOptions(false)}
                            >
                                ×
                            </button>
                            <h3>{selectedProduct.nombre}</h3>
                            <small className={style.descrOpt}>{selectedProduct.descr}</small>
                            <div className={style.optionsGrid}>
                                {selectedProduct.opciones?.map((opcion, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={style.optionCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <div className={style.optionIconContainer}>
                                            {getProductIcon(selectedProduct)}
                                        </div>
                                        <div className={style.optionInfo}>
                                            <p className={style.optionName}>{opcion.nombre}</p>
                                            <p className={style.price}>
                                                ${opcion.precio?.toLocaleString('es-AR')}
                                            </p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => addToCart(selectedProduct, opcion)}
                                                className={style.addButton}
                                            >
                                                Agregar
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CartMoreProducts;