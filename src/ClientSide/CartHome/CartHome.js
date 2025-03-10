"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CartHome.module.css';
import { FaTrash, FaArrowRight, FaMinus, FaPlus } from 'react-icons/fa';
import { useThemeContext } from '@/context/ThemeSwitchContext';
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { useCart } from '@/context/CartContext';

export default function CartHome() {
  const { isDarkMode } = useThemeContext();
  const { 
    cart, 
    removeFromCart, 
    changeQuantity, 
    getTotal, 
    getTotalItems 
  } = useCart();
  
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  // Función para alternar la visibilidad de la vista previa
  const togglePreview = (e) => {
    e.stopPropagation();
    setShowPreview(!showPreview);
  };

  // Cerrar la vista previa cuando se hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPreview && !e.target.closest(`.${styles.page}`)) {
        setShowPreview(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPreview, styles.page]);

  // Manejador para cambiar cantidad (con stopPropagation)
  const handleChangeQuantity = (e, product, amount) => {
    e.stopPropagation();
    changeQuantity(product, amount);
  };

  // Manejador para eliminar (con stopPropagation)
  const handleRemoveFromCart = (e, product) => {
    e.stopPropagation();
    removeFromCart(product);
  };

  // Ir a la página de carrito
  const goToCart = (e) => {
    e.stopPropagation(); 
    setShowPreview(false);
    router.push('/cart');
  };

  // Calcular valores
  const total = getTotal();
  const totalItems = getTotalItems();

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.cartIcon} onClick={togglePreview}>
        <span className={styles.cartCount}>
          {totalItems}
        </span>
        <PiShoppingCartSimpleFill />
      </div>

      {showPreview && cart.length > 0 && (
        <div 
          className={styles['container-preview']} 
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className={styles.cartTitle}>Mi pedido ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</h4>
          
          <div className={styles['search-results']}>
            {cart.map((product, index) => (
              <div className={styles['preview-list']} key={`${product.nombre}-${index}`}>
                <img
                  src="/fakeProduct.jpg"
                  alt={product.nombre}
                  className={styles['product-image-mini']}
                />
                <div className={styles['product-info']}>
                  <h4 className={styles['product-name']}>{product.nombre}</h4>
                  <p className={styles['product-price']}>
                    ${product.precio} {product.quantity > 1 ? `x${product.quantity}` : ''}
                  </p>
                  
                  <div className={styles.quantityControl}>
                    <button 
                      className={styles.quantityButton}
                      onClick={(e) => handleChangeQuantity(e, product, -1)}
                      aria-label="Disminuir cantidad"
                    >
                      <FaMinus />
                    </button>
                    <span className={styles.quantity}>{product.quantity || 1}</span>
                    <button 
                      className={styles.quantityButton}
                      onClick={(e) => handleChangeQuantity(e, product, 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => handleRemoveFromCart(e, product)} 
                  className={styles['remove-button']}
                  aria-label="Eliminar producto"
                >
                  <FaTrash style={{color: 'darkred', fontSize:'larger'}}/>
                </button>
              </div>
            ))}
          </div>
          
          <div className={styles['cart-footer']}>
            <div className={styles['total-price']}>${total.toFixed(2)}</div>
            <button className={styles['add-button']} onClick={goToCart}>
              Ir a pagar <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}