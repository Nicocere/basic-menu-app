"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { menú } from './fakeData';
import fakeProduct from '../../public/fakeProduct.jpg';
import Footer from '@/components/Footer/Footer';
import { FaTrash } from 'react-icons/fa';
// Add to imports
import Swal from 'sweetalert2';
import { FaMinus, FaPlus } from 'react-icons/fa';
// SUPABASE
import { supabase } from '@/config/supabaseClient';
import Link from 'next/link';
import { useAuth } from '@/context/AuthUserContext';


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

export default function Home() {

  const { user } = useAuth();
  const [openCategories, setOpenCategories] = useState({});
  const [quantities, setQuantities] = useState({});
  const [openSubcategories, setOpenSubcategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    subcategoria: '',
    icono: '',
    img: '',
    createdAt: null
  });

  useEffect(() => {
    if (productos) {
      setFormData({
        ...productos,
        precio: productos.precio,
        createdAt: productos.createdAt || null
      });
    }
  }, [productos]);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*');

      console.log("data", data);
      if (error) {
        console.error('Error fetching productos:', error);
      } else {
        setProductos(data);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(savedCart)
    setCart(savedCart);
  }, []);

  // Add quantity handlers
const handleQuantityChange = (productId, change) => {
  setQuantities(prev => ({
    ...prev,
    [productId]: Math.max(1, (prev[productId] || 1) + change)
  }));
};


  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleSubcategory = (subcategory) => {
    setOpenSubcategories((prev) => ({
      ...prev,
      [subcategory]: !prev[subcategory],
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

  // console.log("menu:", menú);
  console.log('productos:', productos);


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

  return (
    <div className={styles.page}>
      <div className={styles.cartIcon} onClick={() => router.push('/cart')}>
        <span className={styles.cartCount}>{cart.length}</span>
        🛒
      </div>
      {cart.length > 0 && (
        <div className={styles['container-preview']} >
          <h4 className={styles.cartTitle}>Mi pedido:</h4>
          <div className={styles['search-results']}>
            {cart.map((product) => (
              <div className={styles['preview-list']} key={product.nombre}>
                <img
                  src="/fakeProduct.jpg"
                  alt={product.nombre}
                  className={styles['product-image-mini']}
                />
                <h4 className={styles['product-name']}>{product.nombre}</h4>
                <p className={styles['product-price']}>${product.precio}</p>
                <button onClick={() => removeFromCart(product)} className={styles['remove-button']}>
                  <FaTrash />
                </button>
              </div>
            ))}
            <h3 className={styles['total-price']}>Total: ${cart.reduce((acc, product) => acc + product.precio, 0)}</h3>
            <button className={styles['add-button']} onClick={() => router.push('/cart')}>Pagar</button>
          </div>
        </div>
      )}

<div className={styles.userGuide}>
        <motion.div 
          className={styles.guideContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.guideTitle}>¿Cómo hacer tu pedido?</h2>
          <div className={styles.steps}>
            <motion.div 
              className={styles.step}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.stepNumber}>1</span>
              <p>Explora nuestro menú y selecciona tus productos favoritos</p>
            </motion.div>
            
            <motion.div 
              className={styles.step}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.stepNumber}>2</span>
              <p>Haz clic en "Agregar" para añadir productos a tu carrito</p>
            </motion.div>
            
            <motion.div 
              className={styles.step}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.stepNumber}>3</span>
              <p>Revisa tu pedido en el carrito y haz clic en "Pagar"</p>
            </motion.div>
            
            <motion.div 
              className={styles.step}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.stepNumber}>4</span>
              <p>Ingresa tu número de mesa o selecciona "Retirar en barra"</p>
            </motion.div>
            
            <motion.div 
              className={styles.step}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.stepNumber}>5</span>
              <p>¡Listo! Te daremos un número de orden para seguir tu pedido</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      
      <main className={styles.main}>
        <div className={styles.menu}>
          <h1 className={styles['menu-title']}>Menú</h1>
          <header className={styles.header}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
          />
          {searchTerm.length > 0 && (
            <SearchResults results={searchResults} addToCart={addToCart} removeFromCart={removeFromCart} />
          )}
      </header>
          {Object.keys(filteredMenu).map((category) => (
            <div key={category} className={styles.category}>
              <h2
                className={styles['category-title']}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </h2>
              {openCategories[category] &&
                Object.keys(filteredMenu[category]).map((subcategory) => (
                  <motion.div
                    key={subcategory}
                    className={styles.subcategory}
                    initial={{ opacity: 0, y: -20 }} // Estado inicial al aparecer
                    animate={{ opacity: 1, y: 0 }}  // Animación al estar visible
                    exit={{ opacity: 0, y: 20 }}    // Animación al desaparecer
                    transition={{ duration: 0.3 }}  // Duración de la animación
                  >
                    <h3
                      className={styles['subcategory-title']}
                      onClick={() => toggleSubcategory(subcategory)}
                    >
                      {subcategory}
                    </h3>

                    {openSubcategories[subcategory] && (
                      <motion.div
                        className={styles['product-list']}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      >
                        {filteredMenu[category][subcategory].map((product) => (
                        <motion.div
                        key={product.nombre}
                        className={styles['product-card']}
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src="/fakeProduct.jpg"
                          alt={product.nombre}
                          className={styles['product-image']}
                        />
                        <h4 className={styles['product-name']}>{product.nombre}</h4>
                        <p className={styles['product-description']}>{product.descripcion}</p>
                        <p className={styles['product-price']}>${product.precio}</p>
                        <div className={styles['product-buttons']}>
                          <div className={styles.quantityControl}>
                            <button 
                              onClick={() => handleQuantityChange(product.nombre, -1)}
                              className={styles.quantityButton}
                            >
                              <FaMinus />
                            </button>
                            <span className={styles.quantity}>
                              {quantities[product.nombre] || 1}
                            </span>
                            <button 
                              onClick={() => handleQuantityChange(product.nombre, 1)}
                              className={styles.quantityButton}
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            className={styles['add-button']}
                          >
                            Agregar
                          </button>
                        </div>
                      </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>

                ))}
            </div>
          ))}
        </div>
      </main>
      <Footer />

      {
        user ? (
          <Link href="/admin" className={styles.adminLink}>
            Perfil Admin
          </Link>
        ) : (
          <Link href="/login" className={styles.adminLink} >Iniciar Sesión
          </Link>
        )
      }

    </div>
  );
}