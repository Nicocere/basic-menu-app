"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ProductsHome.module.css';
import { menú } from '@/app/fakeData';
import Swal from 'sweetalert2';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { supabase } from '@/config/supabaseClient';

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
                <button onClick={() => addToCart(product)} className={styles['add-button']}>Agregar</button>
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
    // Estados principales
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [productos, setProductos] = useState([]);
    
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

    // Cargar carrito desde localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    // Manejadores de eventos
    const handleQuantityChange = (productId, change) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const addToCart = (product) => {
        const quantity = quantities[product.nombre] || 1;
        const itemsToAdd = Array(quantity).fill(product);
        const updatedCart = [...cart, ...itemsToAdd];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        Swal.fire({
            title: '¡Agregado!',
            text: `${quantity} ${product.nombre} agregado al carrito`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    };

    const removeFromCart = (product) => {
        const updatedCart = cart.filter((item) => item.nombre !== product.nombre);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Filtrar menú por término de búsqueda
    const filteredMenu = Object.keys(menú.menu).reduce((acc, category) => {
        const subcategories = Object.keys(menú.menu[category]).reduce((subAcc, subcategory) => {
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

    return (
        <main className={styles.main}>
            <div className={styles.menu}>
                <header className={styles.header}>
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
                            addToCart={addToCart} 
                            removeFromCart={removeFromCart} 
                        />
                    )}
                </header>
                
                {/* Mostrar todas las categorías y subcategorías sin botones para mostrar/ocultar */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {Object.keys(filteredMenu).map((category) => (
                        <motion.div 
                            key={category} 
                            className={styles.category}
                            variants={itemVariants}
                        >
                            <h2 className={styles['category-title']}>{category}</h2>
                            
                            {Object.keys(filteredMenu[category]).map((subcategory) => (
                                <div key={subcategory} className={styles.subcategory}>
                                    <h3 className={styles['subcategory-title']}>{subcategory}</h3>
                                    
                                    <div className={styles['product-list']}>
                                        {filteredMenu[category][subcategory].map((product) => (
                                            <ProductCard
                                                key={product.nombre}
                                                product={product}
                                                quantity={quantities[product.nombre] || 1}
                                                onQuantityChange={handleQuantityChange}
                                                onAddToCart={addToCart}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </main>
    );
}