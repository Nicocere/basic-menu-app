"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./payment.module.css";
import { motion } from "framer-motion";
import { FaCheck, FaShare, FaDownload, FaReceipt } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/config/supabaseClient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import { useMediaQuery } from "@mui/material";

export default function Payment() {
  const isMobileScreen = useMediaQuery("(max-width:768px)");

  const [orderNumber, setOrderNumber] = useState("");
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [pickup, setPickup] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [phoneCostumer, setPhoneCostumer] = useState("");
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const [dowloadRecipe, setDowloadRecipe] = useState(false);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("order"));
    if (!savedOrder) return;

    setCart(savedOrder?.products || []);
    setName(savedOrder?.name || "");
    setPickup(savedOrder?.pickup || false);
    setTableNumber(savedOrder?.tableNumber || "");
    setPhoneCostumer(savedOrder?.cellphone || "");
    setTotal(savedOrder?.total || 0);

    // Generar un número de orden único
    const orderNum = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(orderNum);

    // Guardar en Supabase si no existe
    const saveOrderToSupabase = async () => {
      try {
        // Verificar si el pedido ya existe
        const { data: existingOrder, error: fetchError } = await supabase
          .from("orders")
          .select("order_id")
          .eq("order_id", orderNum)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error al verificar pedido:", fetchError);
          return;
        }

        if (existingOrder) {
          console.log("El pedido ya existe en Supabase.");
          return;
        }

        // Si no existe, insertarlo
        const { error } = await supabase.from("orders").insert([
          {
            order_id: orderNum,
            customer_name: savedOrder.name,
            customer_phone: savedOrder.cellphone,
            table_number: savedOrder.tableNumber,
            pickup: savedOrder.pickup,
            total_amount: savedOrder.total,
            items: JSON.stringify(savedOrder.products),
            payment_method: "MercadoPago",
            payment_status: "Pagado",
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.error("Error al guardar pedido en Supabase:", error);
        } else {
          console.log("Pedido guardado exitosamente en Supabase.");
        }
      } catch (error) {
        console.error("Error al procesar el pedido:", error);
      }
    };

    saveOrderToSupabase();
  }, []);

  const handleBackToMenu = () => {
    localStorage.removeItem("cart");
    router.push("/");
  };

  const handleShare = async () => {
    if (navigator.share) {
      console.log("Compartiendo pedido...");
      try {
        await navigator.share({
          title: "Pedido Confirmado",
          text: `Pedido #${orderNumber} confirmado. Total: $${total}`,
          url: window.location.href,
        });
        console.log("Pedido compartido exitosamente");
      } catch (error) {
        console.error("Error al compartir el pedido:", error);
      }
    } else {
      console.error("La API de Web Share no está disponible en este navegador");
    }
  };

  const handleDownloadQR = () => {
    console.log("Descargando código QR...");
    const qrCodeElement = document.querySelector(`.${styles.qrCode}`);
    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = `pedido_${orderNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };
  const handleDownloadReceipt = () => {

    // Referencia al elemento a convertir
    const receiptElement = document.querySelector(`.${styles.orderCard}`);

    // Detectar si es un dispositivo móvil para optimizar configuración
    const isMobile = window.innerWidth <= 768;

    // 1. Opciones avanzadas para html2canvas con optimización móvil
    const html2canvasOptions = {
      scale: isMobile ? 2 : 3, // Escala adaptativa según dispositivo
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector(`.${styles.orderCard}`);
        if (clonedElement) {
          // Ocultar botones
          const actionsElement = clonedElement.querySelector(`.${styles.actions}`);
          if (actionsElement) {
            actionsElement.style.display = 'none';
          }

          // Ocultar botones individuales por si acaso
          const actionButtons = clonedElement.querySelectorAll(`.${styles.actionButton}`);
          actionButtons.forEach(button => {
            button.style.display = 'none';
          });

          // Ajustar tamaños de fuente para mejor legibilidad en PDF móvil
          if (isMobile) {
            const textElements = clonedElement.querySelectorAll('p, h2, h3, span');
            textElements.forEach(el => {
              const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
              // Asegurar que los textos tengan un tamaño mínimo legible
              if (currentSize < 12) {
                el.style.fontSize = '12px';
              }
            });
          }
        }
      }
    };

    // Mostrar indicador de carga (opcional)
    // setIsGeneratingPDF(true);

    html2canvas(receiptElement, html2canvasOptions)
      .then((canvas) => {
        // 2. Configuración adaptativa de imagen
        const imgData = canvas.toDataURL('image/jpeg', isMobile ? 0.95 : 1.0);

        // 3. Crear PDF con formato optimizado para móvil
        const pdfOptions = {
          orientation: "portrait",
          unit: "pt",
          format: isMobile ? [595, 842] : "a4" // Usar tamaño adaptado para móvil o A4
        };

        const pdf = new jsPDF(pdfOptions);

        // 4. Ajustar proporciones para adaptarse al dispositivo
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // 5. Ajustar márgenes según dispositivo
        const margin = isMobile ? 20 : 40;

        // 6. Colocar la imagen adaptada al dispositivo
        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          margin,
          pdfWidth - (margin * 2),
          Math.min(
            pdfHeight - (margin * 2),
            pdf.internal.pageSize.getHeight() - (margin * 2)
          ),
          null,
          'FAST'
        );

        // 7. Agregar metadatos
        pdf.setProperties({
          title: `Recibo #${orderNumber}`,
          subject: `Pedido #${orderNumber}`,
          author: 'Menu App',
          keywords: 'recibo, pedido, pago',
          creator: 'Menu App'
        });

        // 8. Agregar pie de página optimizado para móvil
        pdf.setFontSize(isMobile ? 8 : 10);
        pdf.setTextColor(100);

        const currentDate = new Date().toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const footerY = pdf.internal.pageSize.getHeight() - (isMobile ? 10 : 20);
        pdf.text(`Generado: ${currentDate}`, margin, footerY);

        if (!isMobile) {
          // En móvil, evitamos textos muy a la derecha que podrían salirse
          pdf.text(`Pedido #${orderNumber}`, pdfWidth - 120, footerY);
        }

        // 9. Guardar PDF con nombre descriptivo
        pdf.save(`recibo_${orderNumber}.pdf`);


        Swal.fire({
          title: 'Recibo generado',
          text: 'El recibo se ha generado correctamente.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          iconColor: '#4e342e',
          confirmButtonColor: '#4e342e',
        }).then(() => {
          setDowloadRecipe(true);
        });


        // Ocultar indicador de carga
        // setIsGeneratingPDF(false);
      })
      .catch((error) => {
        console.error("Error al generar el recibo PDF:", error);
        alert("Hubo un problema al generar el recibo. Inténtalo de nuevo.");
        // setIsGeneratingPDF(false);
      });
  };

  return (
    <div className={styles.paymentPage}>
      <motion.div
        className={styles.successIcon}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaCheck />
      </motion.div>

      <motion.div
        className={styles.contentContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className={styles.title}>¡Gracias, {name}!</h1>
        <div className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <div className={styles.orderInfo}>
              <h2 className={styles.orderNumber}>#{orderNumber}</h2>
              <span className={styles.orderStatus}>Pedido Confirmado</span>
            </div>
            <QRCodeSVG
              value={JSON.stringify({
                orderId: orderNumber,
                orderDate: new Date().toISOString(),
                customer: { name, phone: phoneCostumer },
                pickup,
                tableNumber,
                items: cart.map((product) => ({
                  name: product.nombre,
                  price: product.precio,
                })),
                total,
                paymentStatus: "Pagado",
                paymentMethod: "Mercado Pago",
              })}
              className={styles.qrCode}
              size={isMobileScreen ? 400 : 300}
              level={isMobileScreen ? "M" : "H"}
              marginSize={10}
              bgColor="#ffffff"
              fgColor="#4e342e"
            />
          </div>

          <div className={styles.deliveryInfo}>
            {pickup ? (
              <div className={styles.pickupInfo}>
                <h3>Retirar por Barra</h3>
                <p>Muestra el código QR en la barra para retirar tu pedido</p>
              </div>
            ) : (
              <div className={styles.tableInfo}>
                <h3>Entrega en Mesa</h3>
                <p>Tu pedido será entregado en la mesa {tableNumber}</p>
                {
                  phoneCostumer &&
                  <small className={styles.customerPhone}>
                    Si no te encuentras en la mesa, es posible que te llamemos al n°: {phoneCostumer}
                  </small>

                }
              </div>
            )}
          </div>

          <div className={styles.orderDetails}>
            <h3>Detalles del Pedido</h3>
            {cart.map((product) => (
              <motion.div
                key={product.nombre}
                className={styles.orderItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className={styles.productName}>{product.nombre}</p>
                <p className={styles.productPrice}>${product.precio}</p>
              </motion.div>
            ))}
            <div className={styles.total}>
              <span>Total</span>
              <span>${cart.reduce((acc, product) => acc + product.precio, 0)}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={handleShare}>
              <FaShare /> Compartir
            </button>
            <button className={styles.actionButton} onClick={handleDownloadQR}>
              <FaDownload /> Guardar
            </button>
            <button className={styles.actionButton} onClick={handleDownloadReceipt}>
              <FaReceipt /> Recibo
            </button>
          </div>
        </div>

        {
          !dowloadRecipe ?
            (
              <button className={styles.backButton} onClick={handleDownloadReceipt}>
                <FaReceipt /> Descargar el Recibo
              </button>
            )
            :
            (
              <button className={styles.backButton} onClick={handleBackToMenu}>
                Volver al Menú
              </button>
            )
        }
      </motion.div>
    </div>
  );
}