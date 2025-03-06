"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { FaCheck, FaTimes, FaRedo, FaUser, FaPhone, FaTable, FaShoppingBag } from "react-icons/fa";
import styles from "./testQR.module.css";

const EscanerQR = () => {
  const [scanResult, setScanResult] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Solo inicializar el escáner si no hay un resultado o si se está escaneando de nuevo
    if (!scanResult && !isValidating) {
      // Asegurarnos de que cualquier instancia anterior se limpie
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Error al limpiar escáner:", error);
        }
      }

      // Crear una nueva instancia del escáner
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      });

      // Guardar referencia
      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          setIsValidating(true);
          
          // Intentar parsear el resultado como JSON
          try {
            const parsedQRData = JSON.parse(decodedText);
            setParsedData(parsedQRData);
            setScanResult(decodedText);
          } catch (error) {
            setScanResult(decodedText);
            console.error("Error al parsear código QR:", error);
          }

          // Llamada a la API para validar el pedido
          fetch("/api/validar-pedido", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idPedido: decodedText }),
          })
            .then((res) => res.json())
            .then((data) => {
              setValidationResult(data);
              setIsValidating(false);
            })
            .catch((error) => {
              console.error("Error validando pedido:", error);
              setValidationResult({
                estado: "error",
                mensaje: "Error al conectar con el servidor"
              });
              setIsValidating(false);
            });
        },
        (error) => console.log(error)
      );
    }

    // Función de limpieza
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Error al limpiar escáner:", error);
        }
      }
    };
  }, [scanResult, isValidating]);
  
  const handleScanAgain = () => {
    // Limpiar todos los estados
    setScanResult(null);
    setParsedData(null);
    setValidationResult(null);
    setIsValidating(false);
    
    // Limpiar el escáner anterior si existe
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (error) {
        console.error("Error al limpiar escáner:", error);
      }
    }
  };

  // Formatear fecha para mostrar de manera amigable
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch (error) {
      return "Fecha inválida";
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Validación de Pedidos</h2>
      
      <div className={styles.scannerContainer}>
        {!scanResult && (
          <>
            <div className={styles.qrReader} id="qr-reader-container">
              <div className={styles.scanAnimation}></div>
              <div id="qr-reader" style={{ width: '100%' }}></div>
            </div>
            <div className={styles.instructions}>
              <p>Apunte la cámara hacia el código QR del pedido para validarlo.</p>
              <p>También puede <strong>cargar una imagen</strong> que contenga un código QR.</p>
            </div>
          </>
        )}

        {scanResult && (
          <div className={styles.resultContainer}>
            {isValidating ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p className={styles.loadingText}>Validando pedido...</p>
              </div>
            ) : validationResult ? (
              <>
                <div className={`${styles.validationBanner} ${validationResult.estado === 'exitoso' ? styles.successBanner : styles.errorBanner}`}>
                  <span className={styles.validationIcon}>
                    {validationResult.estado === 'exitoso' ? <FaCheck /> : <FaTimes />}
                  </span>
                  <p className={styles.validationMessage}>{validationResult.mensaje}</p>
                </div>
                
                {parsedData && validationResult.estado === 'exitoso' && (
                  <div className={styles.orderDetails}>
                    {/* El resto del código de visualización... */}
                    <div className={styles.orderHeader}>
                      <div className={styles.orderIdContainer}>
                        <h3 className={styles.orderIdLabel}>Pedido #</h3>
                        <p className={styles.orderId}>{parsedData.orderId}</p>
                      </div>
                      <div className={styles.orderDateContainer}>
                        <h4 className={styles.dateLabel}>Fecha</h4>
                        <p className={styles.date}>{formatDate(parsedData.orderDate)}</p>
                      </div>
                    </div>
                    
                    <div className={styles.sectionDivider}></div>
                    
                    <div className={styles.customerInfo}>
                      <h3 className={styles.sectionTitle}>Cliente</h3>
                      <div className={styles.infoRow}>
                        <div className={styles.infoIcon}><FaUser /></div>
                        <p className={styles.infoText}>{parsedData.customer?.name}</p>
                      </div>
                      <div className={styles.infoRow}>
                        <div className={styles.infoIcon}><FaPhone /></div>
                        <p className={styles.infoText}>{parsedData.customer?.phone}</p>
                      </div>
                    </div>
                    
                    <div className={styles.sectionDivider}></div>
                    
                    <div className={styles.deliveryInfo}>
                      <h3 className={styles.sectionTitle}>Entrega</h3>
                      <div className={styles.infoRow}>
                        <div className={styles.infoIcon}>
                          {parsedData.pickup ? <FaShoppingBag /> : <FaTable />}
                        </div>
                        <p className={styles.infoText}>
                          {parsedData.pickup 
                            ? "Retiro por barra" 
                            : `Mesa: ${parsedData.tableNumber}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className={styles.sectionDivider}></div>
                    
                    <div className={styles.productsContainer}>
                      <h3 className={styles.sectionTitle}>Productos</h3>
                      <table className={styles.productsTable}>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.items?.map((item, index) => (
                            <tr key={index}>
                              <td className={styles.productName}>{item.name}</td>
                              <td className={styles.productQuantity}>{1}</td>
                              <td className={styles.productPrice}>${item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className={styles.totalContainer}>
                      <div className={styles.sectionDivider}></div>
                      <div className={styles.total}>
                        <span className={styles.totalLabel}>Total</span>
                        <span className={styles.totalAmount}>${parsedData.total}</span>
                      </div>
                      <div className={styles.paymentInfo}>
                        <span className={styles.paymentMethod}>
                          Método de pago: {parsedData.paymentMethod || "Mercado Pago"}
                        </span>
                        <span className={styles.paymentStatus}>
                          Estado: {parsedData.paymentStatus || "Pagado"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={handleScanAgain} 
                  className={styles.scanAgainButton}
                >
                  <FaRedo /> Escanear otro código
                </button>
              </>
            ) : (
              <div className={styles.errorContainer}>
                <p className={styles.errorText}>No se pudo validar el código QR</p>
                <button 
                  onClick={handleScanAgain} 
                  className={styles.scanAgainButton}
                >
                  <FaRedo /> Intentar de nuevo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EscanerQR;