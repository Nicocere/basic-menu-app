"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cart.module.css';
import MercadoPagoButton from '@/components/MercadoPago/MercadoPago';
import CartMoreProducts from '@/components/CartMoreProducts/CartMoreProducts';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '@/config/supabaseClient';
import { useThemeContext } from '@/context/ThemeSwitchContext';
import { FaSpinner, FaChair, FaShoppingBasket, FaTrashAlt, FaArrowLeft, 
         FaCreditCard, FaMoneyBillWave, FaArrowRight, FaPizzaSlice, FaHamburger, 
         FaCoffee, FaWineGlassAlt, FaGlassMartini, FaCocktail, FaBreadSlice, 
         FaIceCream, FaWineBottle, FaGlassWhiskey, FaUtensils, FaCheese, 
         FaCarrot } from 'react-icons/fa';
import { BiDrink, BiCake } from 'react-icons/bi';
import { GiNoodles, GiCupcake, GiWrappedSweet, GiChocolateBar, GiSodaCan, 
         GiWaterBottle } from 'react-icons/gi';

import PagoEnEfectivo from '@/components/PagoEnEfectivo/PagoEnEfectivo';

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

export default function Cart() {
  const { isDarkMode } = useThemeContext();
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [pickup, setPickup] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'cash' o 'mercadopago'

  // Estados para Supabase
  const [mesas, setMesas] = useState([]);
  const [loadingMesas, setLoadingMesas] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Cargar el carrito y preferencias guardadas
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

  // Cargar mesas desde Supabase
  useEffect(() => {
    const fetchMesas = async () => {
      try {
        setLoadingMesas(true);
        const { data, error } = await supabase
          .from('tables')
          .select('*')
          .order('name');

        if (error) throw error;
        setMesas(data || []);
      } catch (err) {
        console.error('Error al cargar las mesas:', err);
        setError('No se pudieron cargar las mesas');
      } finally {
        setLoadingMesas(false);
      }
    };

    fetchMesas();
  }, []);

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value);
    localStorage.setItem('tableNumber', event.target.value);
  };

  const handleName = (event) => {
    setName(event.target.value);
    localStorage.setItem('name', event.target.value);
  };

  const handleCellPhone = (event) => {
    setCellphone(event.target.value);
  };

  const handlePickupChange = () => {
    const newPickup = !pickup;
    setPickup(newPickup);
    localStorage.setItem('pickup', JSON.stringify(newPickup));
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
  const cartTotal = cart.reduce((acc, product) => acc + product.precio * (product.quantity || 1), 0);

  // Validación de campos
  const formIsValid = useMemo(() => {
    if (!name.trim() || !cellphone.trim()) {
      return false;
    }

    // Si no es retiro en barra, el número de mesa es obligatorio
    if (!pickup && !tableNumber) {
      return false;
    }

    return true;
  }, [name, cellphone, tableNumber, pickup]);

  const handleShowPaymentOptions = (e) => {
    e.preventDefault();
    setShowValidationErrors(true);
  
    // Solo mostrar las opciones de pago si todos los campos son válidos
    if (formIsValid) {
      const selectedMesa = mesas.find(m => m.id.toString() === tableNumber);
  
      const order = {
        tableNumber: selectedMesa ? selectedMesa.name : '',
        tableId: tableNumber,
        name,
        cellphone,
        pickup,
        total: cartTotal,
        products: cart
      };
  
      localStorage.setItem('order', JSON.stringify(order));
      setShowPaymentSelection(true); // Mostrar selección de método de pago
    } else {
      // Si hay campos inválidos, mostrar la animación de "shake" en el botón
      const button = document.querySelector(`.${styles.validationButton}`);
      button.classList.add(styles.shake);
      setTimeout(() => button.classList.remove(styles.shake), 500);
    }
  };
  
  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    if (method === 'mercadopago') {
      setShowPaymentButton(true);
    }
  };
  
  const handleBackToPaymentSelection = () => {
    setPaymentMethod('');
    setShowPaymentButton(false);
  };

  // Obtener el nombre de la mesa seleccionada si existe
  const selectedMesaName = useMemo(() => {
    if (!tableNumber) return '';
    const mesa = mesas.find(m => m.id.toString() === tableNumber);
    return mesa ? mesa.name : '';
  }, [tableNumber, mesas]);

  return (
    <div className={`${styles.cartPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <h1 className={styles.title}>Tu pedido</h1>
      {cart.length > 0 ? (
        <div className={styles.cartItems}>          
          {cart.map((product, idx) => (
            <div key={idx} className={styles.cartItem}>
              <div className={styles.productIconContainer}>
                {getProductIcon(product)}
              </div>
              <div className={styles.productDetails}>
                <h4 className={styles.productName}>{product.nombre}</h4>
                <div className={styles.productInfo}>
                  <span className={styles.productQuantity}>{product.quantity || 1}</span>
                  <span className={styles.productPrice}>x ${product.precio}</span>
                </div>
                <div className={styles.productTotalPrice}>
                  ${(product.precio * (product.quantity || 1))}
                </div>
              </div>
              <div className={styles.removeButton}>
                <IconButton
                  onClick={() => removeFromCart(product)}
                  aria-label="Eliminar producto"
                  size="small"
                  className={styles.deleteIconButton}
                >
                  <DeleteIcon className={styles.deleteIcon} />
                </IconButton>
              </div>
            </div>
          ))}
          <div className={styles.total}>
            <h3>Total: <span>${cartTotal.toFixed(2)}</span></h3>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.orderDetails}>
            <div className={styles.formGroup}>
              <label className={`${styles.label} ${!pickup && showValidationErrors && !tableNumber ? styles.errorLabel : ''}`}>
                <FaChair className={styles.labelIcon} />
                Mesa
              </label>
              {loadingMesas ? (
                <div className={styles.loadingIndicator}>
                  <FaSpinner className={styles.spinner} /> Cargando mesas...
                </div>
              ) : (
                <select
                  value={tableNumber}
                  onChange={handleTableNumberChange}
                  className={`${styles.select} ${!pickup && showValidationErrors && !tableNumber ? styles.errorInput : ''}`}
                  disabled={pickup}
                  aria-label="Seleccionar mesa"
                >
                  <option value="">Seleccione una mesa</option>
                  {mesas.map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      {mesa.name}
                    </option>
                  ))}
                </select>
              )}
              {!pickup && showValidationErrors && !tableNumber &&
                <span className={styles.errorMessage}>Seleccione una mesa</span>
              }
            </div>

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="pickup-checkbox"
                checked={pickup}
                onChange={handlePickupChange}
                className={styles.checkbox}
              />
              <label htmlFor="pickup-checkbox" className={styles.checkboxLabel}>
                Retirar por barra
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.label} ${showValidationErrors && !name.trim() ? styles.errorLabel : ''}`}>
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={handleName}
                placeholder="Su nombre"
                className={`${styles.input} ${showValidationErrors && !name.trim() ? styles.errorInput : ''}`}
              />
              {showValidationErrors && !name.trim() &&
                <span className={styles.errorMessage}>Ingrese su nombre</span>
              }
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.label} ${showValidationErrors && !cellphone.trim() ? styles.errorLabel : ''}`}>
                Teléfono
              </label>
              <input
                type="tel"
                value={cellphone}
                onChange={handleCellPhone}
                placeholder="Su número de teléfono"
                className={`${styles.input} ${showValidationErrors && !cellphone.trim() ? styles.errorInput : ''}`}
              />
              {showValidationErrors && !cellphone.trim() &&
                <span className={styles.errorMessage}>Ingrese su teléfono</span>
              }
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h3>Resumen del pedido</h3>
            <div className={styles.summaryDetails}>
              {!pickup && selectedMesaName && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Mesa:</span>
                  <span className={styles.summaryValue}>{selectedMesaName}</span>
                </div>
              )}
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total:</span>
                <span className={styles.summaryValue}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <CartMoreProducts />

          <div className={styles.buttons}>
            {!showPaymentSelection ? (
              <button
                className={styles.validationButton}
                onClick={handleShowPaymentOptions}
              >
                Continuar al pago
              </button>
            ) : paymentMethod === 'cash' ? (
              <div className={styles.paymentContainer}>
                <PagoEnEfectivo
                  products={cart}
                  tableNumber={selectedMesaName}
                  customerName={name}
                  customerPhone={cellphone}
                  pickup={pickup}
                  total={cartTotal}
                />
                <button 
                  className={styles.backButton}
                  onClick={handleBackToPaymentSelection}
                >
                  <FaArrowLeft className={styles.buttonIcon} /> Elegir otro método
                </button>
              </div>
            ) : paymentMethod === 'mercadopago' ? (
              <div className={styles.paymentContainer}>
                <MercadoPagoButton
                  products={cart}
                  tableNumber={selectedMesaName}
                  customerName={name}
                  customerPhone={cellphone}
                  pickup={pickup}
                  total={cartTotal}
                />
                <button 
                  className={styles.backButton}
                  onClick={handleBackToPaymentSelection}
                >
                  <FaArrowLeft className={styles.buttonIcon} /> Elegir otro método
                </button>
              </div>
            ) : (
              <div className={styles.paymentMethodSelector}>
                <h3>Selecciona tu método de pago</h3>
                <div className={styles.paymentOptions}>
                  <button 
                    className={styles.paymentOptionButton}
                    onClick={() => handleSelectPaymentMethod('cash')}
                  >
                    <FaMoneyBillWave className={styles.paymentOptionIcon} />
                    <span>Efectivo</span>
                    <p className={styles.paymentOptionDescription}>
                      Paga al recibir tu pedido
                    </p>
                    <FaArrowRight className={styles.paymentArrow} />
                  </button>
                  <button 
                    className={styles.paymentOptionButton}
                    onClick={() => handleSelectPaymentMethod('mercadopago')}
                  >
                    <FaCreditCard className={styles.paymentOptionIcon} />
                    <span>Tarjeta / MercadoPago</span>
                    <p className={styles.paymentOptionDescription}>
                      Paga online de forma segura
                    </p>
                    <FaArrowRight className={styles.paymentArrow} />
                  </button>
                </div>
                <button 
                  className={styles.backButton}
                  onClick={() => setShowPaymentSelection(false)}
                >
                  <FaArrowLeft className={styles.buttonIcon} /> Volver
                </button>
              </div>
            )}
            
            {!showPaymentSelection && (
              <div className={styles.secondaryButtons}>
                <button className={styles.emptyButton} onClick={emptyCart}>
                  <FaTrashAlt className={styles.buttonIcon} /> Vaciar Carrito
                </button>
                <button className={styles.continueButton} onClick={continueShopping}>
                  <FaArrowLeft className={styles.buttonIcon} /> Seguir Comprando
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>
            <FaShoppingBasket />
          </div>
          <p>¡Ups! Tu carrito está vacío</p>
          <span className={styles.spanEmptyCart}>¡Vuelve al inicio para agregar algo delicioso! 🍔</span>

          <CartMoreProducts />
          <button className={styles.continueButton} onClick={continueShopping}>
            <FaArrowLeft className={styles.buttonIcon} /> Volver al Menú
          </button>
        </div>
      )}
    </div>
  );
}