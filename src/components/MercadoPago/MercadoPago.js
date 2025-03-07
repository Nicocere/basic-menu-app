"use client";

import { Wallet } from '@mercadopago/sdk-react'
import { useState } from 'react';
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
  onSuccess 
}) => {
  
  const [isLoading, setIsLoading] = useState(true);

  // Mapear productos para Mercado Pago
  const items = products.map((prod) => ({
    id: prod.id || Math.random().toString(36).substring(2, 15),
    title: prod.nombre || prod.name,
    description: prod.descripcion || prod.descr || 'Sin descripción',
    quantity: prod.quantity || 1,
    unit_price: Number(prod.precio)
  }));

  // Configuración de personalización del botón
  const customization = {
    texts: {
      action: 'pay',
      valueProp: 'security_safety',
    },
    visual: {
      hideValueProp: false,
      buttonBackground: 'default', // default, black, blue, white
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
    total: Number(total),
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

  return (
    <div>
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
        onReady={() => setIsLoading(false)}
        onError={onError}
      />
    </div>
  );
};

export default MercadoPagoButton;