"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { menú } from './fakeData';
import fakeProduct from '../../public/fakeProduct.jpg';

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
  const [openCategories, setOpenCategories] = useState({});
  const [openSubcategories, setOpenSubcategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (product) => {
    setCart((prev) => prev.filter((item) => item.nombre !== product.nombre));
  };

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
        <div>
          <h4 className={styles.cartTitle}>Mi pedido:</h4>
          <div className={styles['search-results']}>
            {cart.map((product) => (
              <div className={styles['preview-list']} key={product.nombre}>
                <h4 className={styles['product-name']}>{product.nombre}</h4>
                <p className={styles['product-price']}>${product.precio}</p>
                <button onClick={() => removeFromCart(product)} className={styles['remove-button']}>Eliminar</button>
              </div>
            ))}
            <h3 className={styles['total-price']}>Total: ${cart.reduce((acc, product) => acc + product.precio, 0)}</h3>
            <button className={styles['remove-button']} onClick={() => router.push('/cart')}>Pagar</button>
          </div>
        </div>
      )}
      <header className={styles.header}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </header>
      <main className={styles.main}>
        {searchTerm.length > 0 && (
          <SearchResults results={searchResults} addToCart={addToCart} removeFromCart={removeFromCart} />
        )}
        <div className={styles.menu}>
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
                  <div key={subcategory} className={styles.subcategory}>
                    <h3
                      className={styles['subcategory-title']}
                      onClick={() => toggleSubcategory(subcategory)}
                    >
                      {subcategory}
                    </h3>
                    {openSubcategories[subcategory] && (
                      <div className={styles['product-list']}>
                        {filteredMenu[category][subcategory].map((product) => (
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
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <p>Restaurante Antonio</p>
        <p>Dirección: Calle Falsa 123</p>
        <p>Teléfono: (123) 456-7890</p>
        <p>Email: contacto@restauranteantonio.com</p>
      </footer>
    </div>
  );
}