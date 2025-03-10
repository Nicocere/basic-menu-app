"use client";

import { Wallet } from '@mercadopago/sdk-react'
import { useState, useEffect } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react'
import { PulseLoader } from "react-spinners";
import Swal from 'sweetalert2';

// Inicializar MercadoPago con la clave pública
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY_T, {
  locale: 'es-AR'
});

const MercadoPagoButton = ({ 
  products, 
  tableNumber, 
  customerName, 
  customerPhone, 
  pickup, 
  total,
  onSuccess // Se usará correctamente ahora
}) => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [totalWithTip, setTotalWithTip] = useState(total);

  // Actualizar el total cuando cambia la propina
  useEffect(() => {
    setTotalWithTip(Number(total) + Number(tipAmount));
  }, [total, tipAmount]);

  // Función para manejar el cambio de porcentaje de propina
  const handleTipChange = (percentage) => {
    setTipPercentage(percentage);
    const calculatedTip = Math.round(Number(total) * (percentage / 100));
    setTipAmount(calculatedTip);
  };

  // Mapear productos para Mercado Pago (incluyendo la propina si existe)
  const items = [...products.map((prod) => ({
    id: prod.id || Math.random().toString(36).substring(2, 15),
    title: prod.nombre || prod.name,
    description: prod.descripcion || prod.descr || 'Sin descripción',
    quantity: prod.quantity || 1,
    unit_price: Number(prod.precio)
  }))];

  // Añadir la propina como un ítem adicional solo si es mayor que cero
  if (tipAmount > 0) {
    items.push({
      id: 'tip',
      title: 'Propina',
      description: `Propina ${tipPercentage}%`,
      quantity: 1,
      unit_price: Number(tipAmount)
    });
  }

  // Configuración de personalización del botón
  const customization = {
    texts: {
      action: 'pay',
      valueProp: 'security_safety',
    },
    visual: {
      hideValueProp: false,
      buttonBackground: 'default',
      valuePropColor: 'black',
      buttonHeight: '48px',
      borderRadius: '15px',
      verticalPadding: '16px',
      horizontalPadding: '0px',
    },
    checkout: {
      theme: {
        elementsColor: '#D4AF37',
        headerColor: '#D4AF37',
      },
    },
  };

  // Crear el cuerpo de la solicitud para MP
  const bodyMP = {
    products: items,
    customer: {
      name: customerName,
      phone: customerPhone,
    },
    tableNumber: tableNumber,
    pickup: pickup,
    total: totalWithTip,
    tipAmount: tipAmount,
    createdAt: new Date()
  };

  const onSubmit = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/mercadopago/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: items }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago');
      }

      const data = await response.json();

      if (data.preferenceId) {
        // Guardar información relevante antes de redirigir
        localStorage.setItem('orderDetails', JSON.stringify(bodyMP));
        
        // window.location.href = `/compras/mp-pago-exitoso`;
        return data.preferenceId;
      } else {
        throw new Error('No se recibió ID de preferencia');
      }

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error al procesar el pago',
        text: error.message || 'Hubo un problema con Mercado Pago',
        icon: 'error',
        confirmButtonColor: '#D4AF37',
      });
      setIsLoading(false);
    }
  };

  const onError = async (error) => {
    console.error("Error con Mercado Pago:", error);
    setIsLoading(false);
    Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al procesar el pago',
      icon: 'error',
      confirmButtonColor: '#D4AF37',
    });
  };

  // Implementamos la función onReady para que también use onSuccess si está disponible
  const handleReady = () => {
    setIsLoading(false);
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess();
    }
  };

  return (
    <div>
      {/* Selector de propina */}
      <div className="tip-container">
        <h4>¿Deseas agregar una propina?</h4>
        <div className="tip-buttons">
          <button 
            className={`tip-button ${tipPercentage === 0 ? 'active' : ''}`} 
            onClick={() => handleTipChange(0)}
          >
            Sin propina
          </button>
          <button 
            className={`tip-button ${tipPercentage === 10 ? 'active' : ''}`}
            onClick={() => handleTipChange(10)}
          >
            10% (${Math.round(Number(total) * 0.1)})
          </button>
          <button 
            className={`tip-button ${tipPercentage === 15 ? 'active' : ''}`}
            onClick={() => handleTipChange(15)}
          >
            15% (${Math.round(Number(total) * 0.15)})
          </button>
          <button 
            className={`tip-button ${tipPercentage === 20 ? 'active' : ''}`}
            onClick={() => handleTipChange(20)}
          >
            20% (${Math.round(Number(total) * 0.2)})
          </button>
        </div>
        
        {tipAmount > 0 && (
          <div className="tip-summary">
            <p>Subtotal: ${Number(total)}</p>
            <p>Propina: ${tipAmount}</p>
            <p className="tip-total">Total con propina: ${totalWithTip}</p>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="spinner-container">
          <p className="loadMP">Procesando pago...</p>
          <PulseLoader loading={isLoading} className="PulseLoader" color="#D4AF37" />
        </div>
      )}

      <Wallet
        customization={customization}
        initialization={{ redirectMode: "self" }}
        onSubmit={onSubmit}
        onReady={handleReady}
        onError={onError}
      />
    </div>
  );
};

export default MercadoPagoButton;