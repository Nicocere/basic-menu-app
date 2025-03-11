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
import { FaSpinner, FaChair, FaUserTie, FaShoppingBasket, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';

export default function Cart() {
  const { isDarkMode } = useThemeContext();
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [pickup, setPickup] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  // Estados para Supabase
  const [mesas, setMesas] = useState([]);
  const [camareros, setCamareros] = useState([]);
  const [camareroId, setCamareroId] = useState('');
  const [loadingMesas, setLoadingMesas] = useState(true);
  const [loadingCamareros, setLoadingCamareros] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Cargar el carrito y preferencias guardadas
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedName = localStorage.getItem('name') || '';
    const savedPickup = JSON.parse(localStorage.getItem('pickup')) || false;
    const savedTableNumber = localStorage.getItem('tableNumber') || '';
    const savedCamareroId = localStorage.getItem('camareroId') || '';

    setCart(savedCart);
    setName(savedName);
    setPickup(savedPickup);
    setTableNumber(savedTableNumber);
    setCamareroId(savedCamareroId);
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

  // Cargar camareros desde Supabase
  useEffect(() => {
    const fetchCamareros = async () => {
      try {
        setLoadingCamareros(true);
        const { data, error } = await supabase
          .from('waiters')
          .select('*')
          .eq('status', true) // Opcional: filtrar solo camareros activos
          .order('name');

        if (error) throw error;
        setCamareros(data || []);
      } catch (err) {
        console.error('Error al cargar los camareros:', err);
        setError('No se pudieron cargar los camareros');
      } finally {
        setLoadingCamareros(false);
      }
    };

    fetchCamareros();
  }, []);

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value);
    localStorage.setItem('tableNumber', event.target.value);
  };

  const handleCamareroChange = (event) => {
    setCamareroId(event.target.value);
    localStorage.setItem('camareroId', event.target.value);
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
  const cartTotal = cart.reduce((acc, product) => acc + product.precio, 0);

  // Validación de campos
  const formIsValid = useMemo(() => {
    if (!name.trim() || !cellphone.trim() || !camareroId) {
      return false;
    }

    // Si no es retiro en barra, el número de mesa es obligatorio
    if (!pickup && !tableNumber) {
      return false;
    }

    return true;
  }, [name, cellphone, tableNumber, camareroId, pickup]);

  const handleShowPaymentOptions = async (e) => {
    e.preventDefault();
    setShowValidationErrors(true);

    // Solo mostrar el botón de pago si todos los campos son válidos
    if (formIsValid) {
      const selectedMesa = mesas.find(m => m.id.toString() === tableNumber);
      const selectedCamarero = camareros.find(c => c.id.toString() === camareroId);

      const order = {
        tableNumber: selectedMesa ? selectedMesa.name : '',
        tableId: tableNumber,
        waiterId: camareroId,
        waiterName: selectedCamarero ? selectedCamarero.name : '',
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

  // Obtener el nombre de la mesa seleccionada si existe
  const selectedMesaName = useMemo(() => {
    if (!tableNumber) return '';
    const mesa = mesas.find(m => m.id.toString() === tableNumber);
    return mesa ? mesa.name : '';
  }, [tableNumber, mesas]);

  // Obtener el nombre del camarero seleccionado si existe
  const selectedCamareroName = useMemo(() => {
    if (!camareroId) return '';
    const camarero = camareros.find(c => c.id.toString() === camareroId);
    return camarero ? camarero.name : '';
  }, [camareroId, camareros]);

  return (
    <div className={`${styles.cartPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <h1 className={styles.title}>Tu pedido</h1>
      {cart.length > 0 ? (
        <div className={styles.cartItems}>          
          {cart.map((product, idx) => (
            <div key={idx} className={styles.cartItem}>
              <div className={styles.productImage}>
                {/* {product.imagen ? (
                  <img src={product.imagen} alt={product.nombre} className={styles.productImage} />
                ) : (
                  <img src="/fakeProduct.jpg" alt={product.nombre} className={styles.productImage} />
                )} */}
                  <img src="/fakeProduct.jpg" alt={product.nombre} className={styles.productImage} />

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
            <h3>Total: <span>${cartTotal}</span></h3>
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

            <div className={styles.formGroup}>
              <label className={`${styles.label} ${showValidationErrors && !camareroId ? styles.errorLabel : ''}`}>
                <FaUserTie className={styles.labelIcon} />
                Camarero
              </label>
              {loadingCamareros ? (
                <div className={styles.loadingIndicator}>
                  <FaSpinner className={styles.spinner} /> Cargando camareros...
                </div>
              ) : (
                <select
                  value={camareroId}
                  onChange={handleCamareroChange}
                  className={`${styles.select} ${showValidationErrors && !camareroId ? styles.errorInput : ''}`}
                  aria-label="Seleccionar camarero"
                >
                  <option value="">Seleccione un camarero</option>
                  {camareros.map((camarero) => (
                    <option key={camarero.id} value={camarero.id}>
                      {camarero.name}
                    </option>
                  ))}
                </select>
              )}
              {showValidationErrors && !camareroId &&
                <span className={styles.errorMessage}>Seleccione un camarero</span>
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
              {selectedCamareroName && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Camarero:</span>
                  <span className={styles.summaryValue}>{selectedCamareroName}</span>
                </div>
              )}
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total:</span>
                <span className={styles.summaryValue}>${cartTotal}</span>
              </div>
            </div>
          </div>

          <CartMoreProducts />

          <div className={styles.buttons}>
            {showPaymentButton ? (
              <MercadoPagoButton
                products={cart}
                tableNumber={selectedMesaName}
                customerName={name}
                customerPhone={cellphone}
                pickup={pickup}
                total={cartTotal}
                waiterId={camareroId}
                waiterName={selectedCamareroName}
              />
            ) : (
              <button
                className={styles.validationButton}
                onClick={handleShowPaymentOptions}
              >
                Continuar al pago
              </button>
            )}
            <div className={styles.secondaryButtons}>
              <button className={styles.emptyButton} onClick={emptyCart}>
                <FaTrashAlt className={styles.buttonIcon} /> Vaciar Carrito
              </button>
              <button className={styles.continueButton} onClick={continueShopping}>
                <FaArrowLeft className={styles.buttonIcon} /> Seguir Comprando
              </button>
            </div>
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