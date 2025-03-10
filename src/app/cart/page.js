"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cart.module.css';
import MercadoPagoButton from '@/components/MercadoPago/MercadoPago';
import CartMoreProducts from '@/components/CartMoreProducts/CartMoreProducts';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [pickup, setPickup] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedName = localStorage.getItem('name') || '';
    const savedPickup = JSON.parse(localStorage.getItem('pickup')) || false;
    const savedTableNumber = localStorage.getItem('tableNumber') || '';
    setCart(savedCart);
    setName(savedName);
    setPickup(savedPickup);
    setTableNumber(savedTableNumber);
  }, []);

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value);
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleCellPhone = (event) => {
    setCellphone(event.target.value);
  };

  const handlePickupChange = () => {
    setPickup(!pickup);
  };

  const removeFromCart = (product) => {
    const updatedCart = cart.filter((item) => item.nombre !== product.nombre);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const emptyCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const continueShopping = () => {
    router.push('/');
  };

  // Calcular el total del carrito una vez para reutilizarlo
  const cartTotal = cart.reduce((acc, product) => acc + product.precio, 0);

  // Validación de campos
  const formIsValid = useMemo(() => {
    if (!name.trim() || !cellphone.trim()) {
      return false;
    }
    
    // Si no es retiro en barra, el número de mesa es obligatorio
    if (!pickup && !tableNumber.trim()) {
      return false;
    }
    
    return true;
  }, [name, cellphone, tableNumber, pickup]);
  
  const handleShowPaymentOptions = async (e) => {
    e.preventDefault();
    setShowValidationErrors(true);

    
    // Solo mostrar el botón de pago si todos los campos son válidos
    if (formIsValid) {
      const order = {
        tableNumber,
        name,
        cellphone,
        pickup,
        total: cartTotal,
        products: cart
      };

      localStorage.setItem('order', JSON.stringify(order));
      setShowPaymentButton(true);
    } else {
      // Si hay campos inválidos, mostrar la animación de "shake" en el botón
      const button = document.querySelector(`.${styles.validationButton}`);
      button.classList.add(styles.shake);
      setTimeout(() => button.classList.remove(styles.shake), 500);
    }
  };

  return (
    <div className={styles.cartPage}>
      <h1 className={styles.title}>Tu pedido</h1>
      {cart.length > 0 ? (
        <div className={styles.cartItems}>
          {cart.map((product) => (
            <div key={product.nombre} className={styles.cartItem}>
              <img src="/fakeProduct.jpg" alt={product.nombre} className={styles.productImage} />
              <div className={styles.productDetails}>
                <h4 className={styles.productName}>{product.nombre}</h4>
                <p className={styles.productPrice}>${product.precio}</p>
                <button onClick={() => removeFromCart(product)} className={styles.removeButton}>Eliminar</button>
              </div>
            </div>
          ))}
          <div className={styles.total}>
            <h3>Total: ${cartTotal}</h3>
          </div>
          <div className={styles.orderDetails}>
            <label className={!pickup && showValidationErrors && !tableNumber.trim() ? styles.errorLabel : ''}>
              Número de Mesa:
              <input
                type="text"
                value={tableNumber}
                onChange={handleTableNumberChange}
                className={`${styles.input} ${!pickup && showValidationErrors && !tableNumber.trim() ? styles.errorInput : ''}`}
                disabled={pickup}
              />
              {!pickup && showValidationErrors && !tableNumber.trim() && 
                <span className={styles.errorMessage}>Ingrese número de mesa</span>
              }
            </label>
            <label>
              <input
                type="checkbox"
                checked={pickup}
                onChange={handlePickupChange}
                className={styles.checkbox}
              />
              Retirar por barra
            </label>
            <label className={showValidationErrors && !name.trim() ? styles.errorLabel : ''}>
              Nombre:
              <input
                type="text"
                value={name}
                onChange={handleName}
                className={`${styles.input} ${showValidationErrors && !name.trim() ? styles.errorInput : ''}`}
              />
              {showValidationErrors && !name.trim() && 
                <span className={styles.errorMessage}>Ingrese su nombre</span>
              }
            </label>
            <label className={showValidationErrors && !cellphone.trim() ? styles.errorLabel : ''}>
              Teléfono:
              <input
                type="text"
                value={cellphone}
                onChange={handleCellPhone}
                className={`${styles.input} ${showValidationErrors && !cellphone.trim() ? styles.errorInput : ''}`}
              />
              {showValidationErrors && !cellphone.trim() && 
                <span className={styles.errorMessage}>Ingrese su teléfono</span>
              }
            </label>
          </div>
            <CartMoreProducts />
          <div className={styles.buttons}>
            {showPaymentButton ? (
              <MercadoPagoButton 
                products={cart}
                tableNumber={tableNumber}
                customerName={name}
                customerPhone={cellphone}
                pickup={pickup}
                total={cartTotal}
              />
            ) : (
              <button 
                className={styles.validationButton} 
                onClick={handleShowPaymentOptions}
              >
                Continuar al pago
              </button>
            )}
            <button className={styles.emptyButton} onClick={emptyCart}>Vaciar Carrito</button>
            <button className={styles.continueButton} onClick={continueShopping}>Seguir Comprando</button>
          </div>

        </div>
      ) : (
        <div className={styles.emptyCart}>
        <p >¡Ups! Tu carrito está vacío :(</p>
          <span className={styles.spanEmptyCart}>¡Vuelve al inicio para agregar algo delicioso! 🍔</span>
        
        <CartMoreProducts />
        <button className={styles.continueButton} onClick={continueShopping}>Volver al Menú</button>
        </div>
      )}

    </div>
  );
}