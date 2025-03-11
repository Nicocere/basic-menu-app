"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CartHome.module.css';
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { useThemeContext } from '@/context/ThemeSwitchContext';
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
      if (showPreview && !e.target.closest(`.${styles.cartContent}`)) {
        setShowPreview(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPreview, styles.cartContent]);

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

  if (totalItems === 0) return null; // No mostrar la barra si no hay productos

  return (
    <div className={`${styles.cartBar} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.cartSummary}>
        <div className={styles.cartInfo}>
          <span className={styles.itemCount}>
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </span>
          <span className={styles.totalPrice}>${total.toFixed(2)}</span>
        </div>
        
        <button 
          className={styles.viewCartButton} 
          onClick={togglePreview}
        >
          <FaShoppingCart /> Ver Carrito
        </button>
      </div>

      {showPreview && (
        <div 
          className={styles.cartContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className={styles.cartTitle}>Mi pedido ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</h4>
          
          <div className={styles.productsList}>
            {cart.map((product, index) => (
              <div className={styles.productItem} key={`${product.nombre}-${index}`}>
                <img
                  src="/fakeProduct.jpg"
                  alt={product.nombre}
                  className={styles.productImage}
                />
                <div className={styles.productInfo}>
                  <h4 className={styles.productName}>{product.nombre}</h4>
                  <p className={styles.productPrice}>
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
                  className={styles.removeButton}
                  aria-label="Eliminar producto"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <button className={styles.checkoutButton} onClick={goToCart}>
            Ir a pagar (${total.toFixed(2)})
          </button>
        </div>
      )}
    </div>
  );
}