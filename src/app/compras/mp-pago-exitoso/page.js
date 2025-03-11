"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./payment.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCheck, FaShare, FaDownload, FaReceipt, 
  FaArrowRight, FaStore, FaTable, FaMobileAlt, FaPrint 
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/config/supabaseClient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import { useMediaQuery } from "@mui/material";
import { useThemeContext } from "@/context/ThemeSwitchContext";
import Link from "next/link";

export default function Payment() {
  // Referencias y estados
  const isMobileScreen = useMediaQuery("(max-width:768px)");
  const receiptRef = useRef(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [pickup, setPickup] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [phoneCostumer, setPhoneCostumer] = useState("");
  const [total, setTotal] = useState(0);
  const [orderDate, setOrderDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const router = useRouter();

  const { isDarkMode } = useThemeContext();
  
  // Carga de datos del pedido 
  useEffect(() => {
    const loadOrderData = async () => {
      try {
        const savedOrder = JSON.parse(localStorage.getItem("order"));
        if (!savedOrder) {
          console.error("No se encontró información del pedido");
          return;
        }

        // Formatear datos
        setCart(savedOrder?.products || []);
        setName(savedOrder?.name || "");
        setPickup(savedOrder?.pickup || false);
        setTableNumber(savedOrder?.tableNumber || "");
        setPhoneCostumer(savedOrder?.cellphone || "");
        setTotal(savedOrder?.total || 0);
        
        // Fecha y hora formateada
        const now = new Date();
        setOrderDate(now.toLocaleString('es-AR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }));

        // Generar número de orden
        const orderNum = Math.floor(100000 + Math.random() * 900000).toString();
        setOrderNumber(orderNum);
        
        // Guardar en Supabase
        await saveOrderToSupabase(savedOrder, orderNum);
        
      } catch (error) {
        console.error("Error al cargar datos del pedido:", error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cargar los datos del pedido.',
          icon: 'error',
          iconColor: isDarkMode ? '#f88070' : '#e53935',
          confirmButtonColor: isDarkMode ? '#7b5e57' : '#4e342e',
        });
      }
    };

    loadOrderData();
  }, [isDarkMode]);

  // Guardar pedido en Supabase
  const saveOrderToSupabase = async (savedOrder, orderNum) => {
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
      }
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
    }
  };

  // Volver al menú principal
  const handleBackToMenu = () => {
    localStorage.removeItem("cart");
    router.push("/");
  };

  // Compartir el pedido
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Pedido Confirmado",
          text: `¡Mi pedido #${orderNumber} ha sido confirmado! Total: $${total.toLocaleString('es-AR')}`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error al compartir:", error);
        }
      }
    } else {
      Swal.fire({
        title: 'Compartir no disponible',
        text: 'Tu navegador no soporta la función de compartir.',
        icon: 'info',
        iconColor: isDarkMode ? '#64b5f6' : '#1976d2',
        confirmButtonColor: isDarkMode ? '#7b5e57' : '#4e342e',
      });
    }
  };

  // Descargar código QR
  const handleDownloadQR = () => {
    try {
      const qrCodeElement = document.querySelector(`.${styles.qrCode}`);
      if (!qrCodeElement) {
        throw new Error("Elemento QR no encontrado");
      }
      
      setIsLoading(true);
      
      html2canvas(qrCodeElement, { 
        backgroundColor: isDarkMode ? "#121212" : "#ffffff",
        scale: 3, // Alta calidad
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `pedido_${orderNumber}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        setIsLoading(false);
        
        Swal.fire({
          title: 'QR Guardado',
          text: 'El código QR se ha descargado correctamente.',
          icon: 'success',
          iconColor: isDarkMode ? '#81c784' : '#4caf50',
          confirmButtonColor: isDarkMode ? '#7b5e57' : '#4e342e',
          toast: true,
          position: 'bottom-end',
          timer: 3000,
          showConfirmButton: false
        });
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error al descargar QR:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo descargar el código QR.',
        icon: 'error',
        iconColor: isDarkMode ? '#f88070' : '#e53935',
        confirmButtonColor: isDarkMode ? '#7b5e57' : '#4e342e',
      });
    }
  };
  
  // Generar recibo en PDF
  const handleDownloadReceipt = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Referencia al elemento a convertir
      const receiptElement = receiptRef.current;
      if (!receiptElement) {
        throw new Error("Elemento de recibo no encontrado");
      }

      // Opciones para html2canvas
      const html2canvasOptions = {
        scale: isMobileScreen ? 2 : 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: isDarkMode ? "#121212" : "#ffffff",
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector(`.${styles.orderCard}`);
          if (clonedElement) {
            // Ocultar botones en la versión PDF
            const actionsElement = clonedElement.querySelector(`.${styles.actions}`);
            if (actionsElement) {
              actionsElement.style.display = 'none';
            }
          }
        }
      };

      // Generar canvas
      const canvas = await html2canvas(receiptElement, html2canvasOptions);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Configurar PDF
      const pdfOptions = {
        orientation: "portrait",
        unit: "pt",
        format: isMobileScreen ? [595, 842] : "a4"
      };

      const pdf = new jsPDF(pdfOptions);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40; // Márgenes
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Añadir imagen al PDF
      pdf.addImage(
        imgData,
        'JPEG',
        20, // Margen izquierdo
        20, // Margen superior
        pdfWidth,
        pdfHeight,
        null,
        'FAST'
      );

      // Añadir metadatos y pie de página
      pdf.setProperties({
        title: `Recibo #${orderNumber}`,
        subject: `Pedido #${orderNumber}`,
        author: 'Menu App',
        keywords: 'recibo, pedido, pago',
        creator: 'Menu App'
      });

      pdf.setFontSize(isMobileScreen ? 8 : 10);
      pdf.setTextColor(isDarkMode ? 200 : 100);
      
      const footerText = `Pedido #${orderNumber} - Generado: ${new Date().toLocaleDateString()}`;
      const footerY = pdf.internal.pageSize.getHeight() - 15;
      pdf.text(footerText, pdf.internal.pageSize.getWidth() / 2, footerY, { align: 'center' });

      // Guardar PDF
      pdf.save(`recibo_${orderNumber}.pdf`);

      setDownloadComplete(true);
      setIsLoading(false);

      Swal.fire({
        title: 'Recibo generado',
        text: 'El recibo se ha descargado correctamente.',
        icon: 'success',
        iconColor: isDarkMode ? '#81c784' : '#4caf50',
        confirmButtonColor: isDarkMode ? '#7b5e57' : '#4e342e',
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error al generar recibo:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo generar el recibo PDF.',
        icon: 'error',
        iconColor: isDarkMode ? '#f88070' : '#e53935',
        confirmButtonColor: isDarkMode ? '#7b5e57' : '#4e342e',
      });
    }
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };
  
  const successIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: 0.2 
      } 
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: 0.5
      } 
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        delay: 0.7
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: 0.9 + (i * 0.1)
      } 
    })
  };

  return (
    <motion.div 
      className={`${styles.paymentPage} ${isDarkMode ? styles.darkTheme : ''}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className={styles.successIcon}
        variants={successIconVariants}
      >
        <FaCheck />
      </motion.div>

      <motion.h1 
        className={styles.title}
        variants={titleVariants}
      >
        <span className={styles.titleGreeting}>¡Gracias</span> {name}!
      </motion.h1>
      
      <motion.p className={styles.subtitle} variants={titleVariants}>
        Tu pedido ha sido confirmado y procesado correctamente
      </motion.p>
      
      <motion.div
        className={styles.orderCard}
        variants={cardVariants}
        ref={receiptRef}
      >
        <div className={styles.cardHeader}>
          <div className={styles.orderInfo}>
            <h2 className={styles.orderNumber}>#{orderNumber}</h2>
            <div className={styles.orderStatusBadge}>
              <span className={styles.statusDot}></span>
              Pago confirmado
            </div>
            <div className={styles.orderDate}>{orderDate}</div>
          </div>
          
          <div className={styles.qrContainer}>
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
              size={isMobileScreen ? 120 : 150}
              level="M"
              includeMargin={true}
              bgColor={isDarkMode ? "#2d2d2d" : "#ffffff"}
              fgColor={isDarkMode ? "#e0e0e0" : "#4e342e"}
            />
          </div>
        </div>

        <div className={styles.deliveryInfo}>
          {pickup ? (
            <>
              <div className={styles.deliveryType}>
                <FaStore className={styles.infoIcon} />
                <h3>Retirar por Barra</h3>
              </div>
              <p>Muestra el código QR en la barra cuando vayas a retirar tu pedido</p>
            </>
          ) : (
            <>
              <div className={styles.deliveryType}>
                <FaTable className={styles.infoIcon} />
                <h3>Entrega en Mesa {tableNumber}</h3>
              </div>
              <p>Tu pedido será llevado directamente a tu mesa</p>
              {phoneCostumer && (
                <div className={styles.phoneInfo}>
                  <FaMobileAlt className={styles.phoneIcon} />
                  <span>{phoneCostumer}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.orderDetails}>
          <h3 className={styles.sectionTitle}>
            Detalle del Pedido
          </h3>
          <div className={styles.itemsContainer}>
            {cart.map((product, index) => (
              <motion.div
                key={`${product.id || product.nombre}_${index}`}
                className={styles.orderItem}
                custom={index}
                variants={itemVariants}
              >
                <div className={styles.itemInfo}>
                  <p className={styles.productName}>{product.nombre}</p>
                  {product.quantity && product.quantity > 1 && (
                    <span className={styles.productQuantity}>x{product.quantity}</span>
                  )}
                </div>
                <p className={styles.productPrice}>
                  ${product.precio.toLocaleString('es-AR')}
                </p>
              </motion.div>
            ))}
          </div>
          <div className={styles.totalContainer}>
            <div className={styles.totalLine}></div>
            <div className={styles.total}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${styles.shareButton}`} 
            onClick={handleShare}
            aria-label="Compartir pedido"
          >
            <FaShare className={styles.buttonIcon} />
            <span className={styles.buttonText}>Compartir</span>
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.qrButton}`} 
            onClick={handleDownloadQR}
            aria-label="Descargar código QR"
            disabled={isLoading}
          >
            <FaDownload className={styles.buttonIcon} />
            <span className={styles.buttonText}>Guardar QR</span>
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.receiptButton}`} 
            onClick={handleDownloadReceipt}
            aria-label="Descargar recibo"
            disabled={isLoading}
          >
            <FaReceipt className={styles.buttonIcon} />
            <span className={styles.buttonText}>Recibo PDF</span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className={styles.loadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.loadingSpinner}></div>
            <p>Procesando...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className={styles.bottomActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {downloadComplete ? (
          <Link href="/" className={styles.primaryButton}>
            <span>Volver al menú</span>
            <FaArrowRight className={styles.buttonIcon} />
          </Link>
        ) : (
          <button 
            className={styles.primaryButton}
            onClick={handleDownloadReceipt}
            disabled={isLoading}
          >
            <FaPrint className={styles.buttonIcon} />
            <span>Descargar Comprobante</span>
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}