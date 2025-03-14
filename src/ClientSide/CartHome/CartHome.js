"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CartHome.module.css';
import { FaTrash, FaShoppingCart, FaMinus, FaPlus, FaPizzaSlice, FaHamburger, 
         FaCoffee, FaWineGlassAlt, FaGlassMartini, FaCocktail, FaBreadSlice, 
         FaIceCream, FaWineBottle, FaGlassWhiskey, FaUtensils, FaCheese, 
         FaCarrot } from 'react-icons/fa';
import { BiDrink, BiCake } from 'react-icons/bi';
import { GiNoodles, GiCupcake, GiWrappedSweet, GiChocolateBar, GiSodaCan, 
         GiWaterBottle } from 'react-icons/gi';
import { useThemeContext } from '@/context/ThemeSwitchContext';
import { useCart } from '@/context/CartContext';

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
                <div className={styles.productIcon}>
                  {getProductIcon(product)}
                </div>
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