import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMoneyBillWave, FaReceipt, FaCheck } from 'react-icons/fa';
import { supabase } from '@/config/supabaseClient';
import styles from './PagoEnEfectivo.module.css';

export default function PagoEnEfectivo({ 
  products, 
  tableNumber, 
  customerName, 
  customerPhone, 
  pickup, 
  total, 
  waiterId, 
  waiterName 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    try {
      // Generar número de orden único
      const orderNum = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Guardar en Supabase
      const { error } = await supabase.from("orders").insert([
        {
          order_id: orderNum,
          customer_name: customerName,
          customer_phone: customerPhone,
          table_number: tableNumber,
          pickup: pickup,
          total_amount: total,
          items: JSON.stringify(products),
          payment_method: "Efectivo",
          payment_status: "Pendiente",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      
      // Guardar en localStorage para la página de confirmación
      const order = {
        products,
        name: customerName,
        cellphone: customerPhone,
        tableNumber,
        pickup,
        total,
        waiterId,
        waiterName,
        paymentMethod: 'Efectivo'
      };
      
      localStorage.setItem('order', JSON.stringify(order));
      localStorage.removeItem('cart');
      
      setSuccess(true);
      
      // Redirigir a la página de confirmación después de un breve retraso
      setTimeout(() => {
        router.push('/compras/efectivo-confirmacion');
      }, 1500);
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.cashPaymentContainer}>
      <div className={styles.cashPaymentHeader}>
        <FaMoneyBillWave className={styles.cashIcon} />
        <h3>Pago en Efectivo</h3>
      </div>
      
      <div className={styles.cashPaymentInfo}>
        <p>
          Al confirmar tu pedido, podrás pagarlo en efectivo cuando lo recibas en tu mesa
          {pickup ? ' o cuando lo retires por la barra' : ''}.
        </p>
        
        <div className={styles.orderSummary}>
          <div className={styles.summaryItem}>
            <FaReceipt />
            <span>Total a pagar: <strong>${total}</strong></span>
          </div>
        </div>
      </div>
      
      <button
        className={styles.confirmButton}
        onClick={handleSubmitOrder}
        disabled={isSubmitting || success}
      >
        {isSubmitting ? (
          <span className={styles.spinnerContainer}>
            <span className={styles.spinner}></span> Procesando...
          </span>
        ) : success ? (
          <span className={styles.successContainer}>
            <FaCheck /> ¡Pedido confirmado!
          </span>
        ) : (
          'Confirmar Pedido'
        )}
      </button>
    </div>
  );
}