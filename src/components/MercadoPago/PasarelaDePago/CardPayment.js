/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { CardPayment } from '@mercadopago/sdk-react';
import { PulseLoader } from "react-spinners";
import React from 'react';
import { usePageContext } from '@/context/Context';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import localforage from 'localforage';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import { addDoc, collection } from 'firebase/firestore';

initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
  locale: 'es-AR'
});

const CardPaymentMP = ({ nombreDestinatario, apellidoDestinatario, phoneDestinatario, mailComprador,
  localidad, precioLocalidad, calle, altura, piso, dedicatoria, nombreComprador, phoneComprador, apellidoComprador, fechaEnvio,
  horarioEnvio, servicioPremium, envioPremium, finalPrice, title, description, picture_url, category_id, retiraEnLocal,
  quantity, id, size, products, total }) => {

  const navigation = useRouter()

  const { CartID, UserID } = usePageContext();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingMessage, setProcessingMessage] = useState('Procesando el pago, por favor espere...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingBackend, setIsProcessingBackend] = useState(false);


  const items = products.map((prod) => ({
    id: prod.id,
    title: prod.name,
    description: prod.descr,
    quantity: quantity,
    unit_price: Number(prod.precio), // Aquí se establece el precio individual de cada producto
  }));

  const initialization = {
    amount: total,
    payer: {
      email: mailComprador,
    },
    installments: 1,  // Puedes ajustar esto según tus necesidades

  }

  const customization = {
    visual: {
      style: {
        customVariables: {
          textPrimaryColor: "white",
          textSecondaryColor: "#4b4b4b",
          inputBackgroundColor: "#2f1a0f2e", 
          formBackgroundColor: "transparent", //
          baseColor: "#D4AF37 ", 
          baseColorFirstVariant: "#2f1a0f", 
          baseColorSecondVariant: "#2f1a0f",  
          successColor: "#D4AF37", // rosa
          outlinePrimaryColor: "#D4AF37 ",
          formPadding: "",
          errorColor: "darkred", // Rosa
          inputFocusedBorderWidth: "1px solid #2f1a0f", // violeta oscuro cuando enfocado
          inputFocusedBoxShadow: "0 0 5px #2f1a0f", // Sombra violeta oscuro cuando enfocado
          inputErrorFocusedBoxShadow: "0 0 5px red", // Sombra rosa cuando hay un error
          disabledBackgroundColor: 'darkred'
        }
      }
    },
    paymentMethods: {
      maxInstallments: 1,
    }
  }


  // Obtener el precio total de tu envío
  let shippingCost;
  let shippingTitle
  if (servicioPremium && precioLocalidad) {
    shippingCost = precioLocalidad + envioPremium; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
    shippingTitle = `Producto: ${title} + Servicio Premium`;
  } else if (precioLocalidad) {
    shippingTitle = `Producto: ${title} + Costo de Envío`;
    shippingCost = precioLocalidad; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
  } else if (retiraEnLocal) {
    shippingTitle = `Producto: ${title} + Sin Costo de Envío (Retira en Local)`;
    shippingCost = 0; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
  }

  // Añadir el costo de envío como un ítem adicional
  const shippingItem = {
    id: 'ShippingCost', // ID que identifique el costo de envío
    title: title,
    quantity: 1,
    unit_price: Number(shippingCost),
  };

  // Definir onSubmit aquí fuera de useEffect
  const onSubmit = async (formData) => {
    setIsLoading(true);
    setIsProcessingBackend(true);
    setProcessingMessage('Procesando el pago, por favor espere...');

    let bodyMP = {
      MercadoPago: true,
      createdAt: new Date(),
      products: products,
      item: items,
      CartID: CartID,
      datosComprador: {
        UserID: UserID,
        nombreComprador: nombreComprador,
        apellidoComprador: apellidoComprador,
        email: mailComprador,
        tel_comprador: phoneComprador,
      },
      mp_data: {
        data: {
          ...formData,
          description: shippingTitle
        }
      }
    };

    if (retiraEnLocal) {
      bodyMP.retiraEnLocal = true;
      bodyMP.datosEnvio = {
        fecha: fechaEnvio,
        horario: horarioEnvio,
        dedicatoria: dedicatoria ? dedicatoria : 'Sin dedicatoria',
        products: items,
        totalPrice: Number(total),
      };
    } else {
      bodyMP.retiraEnLocal = false
      bodyMP.datosEnvio = {
        nombreDestinatario: nombreDestinatario,
        apellidoDestinatario: apellidoDestinatario,
        phoneDestinatario: phoneDestinatario,
        fecha: fechaEnvio,
        horario: horarioEnvio,
        localidad: localidad,
        precio_envio: precioLocalidad,
        calle: calle,
        altura: altura,
        piso: piso,
        dedicatoria: dedicatoria,
        products: items,
        totalPrice: Number(total),
        servicioPremium: servicioPremium,
        envioPremium: envioPremium,
      };
    }

    try {
      await localforage.setItem('shoppingCart', bodyMP);

      const response = await fetch('https://www.floreriasargentinas.com/api/mercadopago/process_payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyMP)
      });

      const data = await response.json();
      setIsProcessingBackend(false); // Deja de mostrar el mensaje de procesamiento

      if (response.ok) {
        if (data.status === 'approved') {
          Swal.fire({
            title: '¡Compra exitosa!',
            text: 'Terminando de procesar su pedido...',
            icon: 'success',
            iconColor: '#D4AF37',
            color: '#2f1a0f',
            position: 'center',
            toast: true,
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          navigation.push('/compras/mercadopago');
        } else if (data.status === 'in_process') {
          Swal.fire({
            title: '¡Pago en proceso!',
            text: 'El pago está en proceso. Por favor, espere a que se complete la revisión.',
            icon: 'info',
            iconColor: '#D4AF37',
            color: '#2f1a0f',
            position: 'center',
            toast: true,
            timer: 5500,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          navigation.push('/compras/pendiente');

          await localforage.setItem('paymentInProcess', paymentInProcess);

          const paymentInProcess = {
            payment_id: data.id,
            status: data.status,
            status_detail: data.status_detail,
            created_at: data.date_created,
            ...bodyMP
          }
          await addDoc(collection(baseDeDatos, 'floreriasargentinas-payments-in-process'), newOrderData);



        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'El pago no fue aprobado. Por favor, intente nuevamente.',
            icon: 'error',
            iconColor: 'red',
            color: 'red',
            position: 'center',
            toast: true,
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          setErrorMessage('El pago no fue aprobado. Por favor, intente nuevamente.');
        }
      } else {
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un error al procesar la compra, inténtelo de nuevo.',
          icon: 'error',
          iconColor: '#D4AF37',
          color: '#D4AF37',
          position: 'center',
          toast: true,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        console.error('La respuesta de la API no contiene la URL de redirección esperada.');
        setErrorMessage('Hubo un error al procesar la compra, inténtelo de nuevo.');
      }

    } catch (error) {
      setIsProcessingBackend(false); // Deja de mostrar el mensaje de procesamiento
      console.log('Error:', error);
      setErrorMessage('Hubo un error al procesar la compra, inténtelo de nuevo.');
    } finally {
      setIsLoading(false); // Independientemente del resultado, deja de mostrar el spinner de carga inicial
    }
  };


  const onError = async (error) => {
    console.log('Hubo un error al procesar la compra', error);
    setErrorMessage('Hubo un error al procesar la compra, inténtelo de nuevo.');
  };

  const onReady = async () => {
    setIsLoading(false)
  };


  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <p className="loadMP">Cargando...</p>
          <PulseLoader loading={isLoading} className="PulseLoader " color="#D4AF37 " />
        </div>
      )}

      {isProcessingBackend && (
        <div className="spinner-container">
          <p className="loadMP">{processingMessage}</p>
          <PulseLoader loading={isProcessingBackend} className="PulseLoader " color="#D4AF37 " />
        </div>
      )}


      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}

      {!isProcessingBackend && (
        <div id="walletBrick_container">
          <CardPayment
            customization={customization}
            initialization={initialization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
          />
        </div>
      )}

    </div>
  );
};

export default CardPaymentMP;