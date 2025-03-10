"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      // Asegurar que cada producto tiene una propiedad quantity
      const cartWithQuantity = savedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));
      setCart(cartWithQuantity);
    };
    
    loadCart();
    
    // Escuchar cambios en localStorage (por si hay otros componentes que lo modifican)
    const handleStorageChange = (event) => {
      if (event.key === 'cart' || event.key === null) {
        loadCart();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', loadCart);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, [cartUpdateTrigger]);

  // Función para actualizar el localStorage
  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartUpdateTrigger(prev => prev + 1); // Incrementar para forzar actualización
    
    // Disparar un evento personalizado
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  // Añadir producto al carrito
  const addToCart = (product, quantity = 1) => {
    const updatedCart = [...cart];
    
    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = updatedCart.findIndex(item => item.nombre === product.nombre);
    
    if (existingProductIndex >= 0) {
      // Producto existe, aumentar cantidad
      updatedCart[existingProductIndex] = {
        ...updatedCart[existingProductIndex],
        quantity: (updatedCart[existingProductIndex].quantity || 1) + quantity
      };
    } else {
      // Producto no existe, añadir con cantidad
      updatedCart.push({
        ...product,
        quantity: quantity
      });
    }
    
    setCart(updatedCart);
    updateLocalStorage(updatedCart);

    // Notificación
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

  // Cambiar cantidad de un producto
  const changeQuantity = (product, amount) => {
    const updatedCart = cart.map(item => {
      if (item.nombre === product.nombre) {
        const newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  // Eliminar producto con SweetAlert
  const removeFromCart = (productToRemove, forceQuantity = null) => {
    const currentQuantity = productToRemove.quantity || 1;
    
    // Si se proporciona una cantidad específica o solo hay 1 unidad
    if (forceQuantity || currentQuantity === 1) {
      const quantityToRemove = forceQuantity || 1;
      handleRemoval(productToRemove, quantityToRemove);
      return;
    }
    
    // Mostrar diálogo para elegir cantidad a eliminar
    Swal.fire({
      title: '¿Cuántas unidades deseas eliminar?',
      html: `
        <div class="quantity-selector">
          <p>Producto: ${productToRemove.nombre}</p>
          <p>Cantidad actual: ${currentQuantity}</p>
          <div class="quantity-input">
            <input 
              id="quantity-input" 
              type="number" 
              min="1" 
              max="${currentQuantity}" 
              value="1"
              class="swal2-input" 
              style="width: 100px; text-align: center;"
            >
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      stopKeydownPropagation: true,
      didOpen: () => {
        const input = document.getElementById('quantity-input');
        input.focus();
        
        // Prevenir propagación de eventos desde el modal
        const modal = document.querySelector('.swal2-container');
        if (modal) {
          modal.addEventListener('click', e => e.stopPropagation());
        }
      },
      preConfirm: () => {
        const quantityToRemove = parseInt(document.getElementById('quantity-input').value);
        if (isNaN(quantityToRemove) || quantityToRemove < 1 || quantityToRemove > currentQuantity) {
          Swal.showValidationMessage('Ingresa una cantidad válida');
          return false;
        }
        return quantityToRemove;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoval(productToRemove, result.value);
      }
    });
  };
  
  // Función para manejar la eliminación real
  const handleRemoval = (productToRemove, quantityToRemove) => {
    const updatedCart = cart.map(product => {
      if (product.nombre === productToRemove.nombre) {
        const newQuantity = product.quantity - quantityToRemove;
        // Si la nueva cantidad es 0 o menos, no incluir este producto
        if (newQuantity <= 0) return null;
        return { ...product, quantity: newQuantity };
      }
      return product;
    }).filter(Boolean); // Eliminar los null
    
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
    
    // Notificación de éxito
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    
    Toast.fire({
      icon: 'success',
      title: quantityToRemove > 1 ? 
        `${quantityToRemove} unidades eliminadas` : 
        'Producto eliminado'
    });
  };

  // Vaciar el carrito completamente
  const emptyCart = () => {
    setCart([]);
    updateLocalStorage([]);
  };

  // Calcular total
  const getTotal = () => {
    return cart.reduce((acc, product) => 
      acc + (product.precio * (product.quantity || 1)), 0
    );
  };

  // Contar items totales
  const getTotalItems = () => {
    return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  // Valor para proporcionar al contexto
  const value = {
    cart,
    addToCart,
    removeFromCart,
    changeQuantity,
    emptyCart,
    getTotal,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}