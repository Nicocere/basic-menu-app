"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import styles from './verOrdenes.module.css';
import { FaCheck, FaEye, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Cargar órdenes desde Supabase
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        
        let query = supabase
          .from('orders')
          .select('*')
          .order(sortField, { ascending: sortDirection === 'asc' });
        
        if (filterStatus === 'delivered') {
          query = query.eq('delivered', true);
        } else if (filterStatus === 'pending') {
          query = query.eq('delivered', false);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Convertir items de JSON string a objeto si es necesario
        const processedData = data.map(order => ({
          ...order,
          items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        }));
        
        setOrders(processedData);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
        setError('No se pudieron cargar las órdenes. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [sortField, sortDirection, filterStatus]);

  // Filtrar órdenes basado en el término de búsqueda
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      order.order_id.toLowerCase().includes(searchTermLower) ||
      order.customer_name.toLowerCase().includes(searchTermLower) ||
      order.customer_phone.toLowerCase().includes(searchTermLower) ||
      (order.table_number && order.table_number.toLowerCase().includes(searchTermLower))
    );
  });

  // Paginar resultados
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Marcar un pedido como entregado
  const markAsDelivered = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ delivered: true })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Actualizar estado local
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, delivered: true } : order
      ));
      
      // Si la orden seleccionada es la que se marcó como entregada, actualizar también
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, delivered: true });
      }
    } catch (error) {
      console.error('Error al marcar como entregado:', error);
      alert('No se pudo actualizar el estado del pedido. Intenta de nuevo.');
    }
  };

  
  // Eliminar un pedido
  const deleteOrder = async (orderId) => {
    // Confirmar antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este pedido? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c8a25c', // Color accent-primary (dorado whisky)
      cancelButtonColor: '#9b4e33', // Color accent-secondary (caoba bourbon)
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      iconColor: '#c8a25c', // Color accent-primary
      background: '#1c1c24', // Color surface-1
      color: '#ffffff', // Color text-primary
      customClass: {
        popup: 'swal-premium-popup',
        title: 'swal-premium-title',
        confirmButton: 'swal-premium-confirm',
        cancelButton: 'swal-premium-cancel'
      },
      backdrop: `rgba(12, 12, 15, 0.8)`, // Color bg-primary con transparencia
      borderRadius: '12px', // --radius-md
      focusConfirm: false
    });
  
    if (!result.isConfirmed) {
      return;
    }
  
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Actualizar estado local
      setOrders(orders.filter(order => order.id !== orderId));
      
      // Si la orden seleccionada es la que se eliminó, cerrar el modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
  
      Swal.fire({
        title: '¡Eliminado!',
        text: 'Pedido eliminado con éxito',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        iconColor: '#ff4757', // Color success
        background: '#1c1c24', // Color surface-1
        color: '#ffffff', // Color text-primary
        customClass: {
          popup: 'swal-premium-popup',
          title: 'swal-premium-title'
        },
        backdrop: `rgba(12, 12, 15, 0.8)` // Color bg-primary con transparencia
      });
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el pedido. Intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        iconColor: '#f44336', // Color error
        confirmButtonColor: '#c8a25c', // Color accent-primary
        background: '#1c1c24', // Color surface-1
        color: '#ffffff', // Color text-primary
        customClass: {
          popup: 'swal-premium-popup',
          title: 'swal-premium-title',
          confirmButton: 'swal-premium-confirm'
        },
        backdrop: `rgba(12, 12, 15, 0.8)` // Color bg-primary con transparencia
      });
    }
  };
  

  // Renderizar detalles de una orden
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div className={styles.orderDetailsOverlay}>
        <div className={styles.orderDetailsModal}>
          <div className={styles.orderDetailsHeader}>
            <h2>Detalles del Pedido #{selectedOrder.order_id}</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
          </div>
          
          <div className={styles.orderDetailsContent}>
            <div className={styles.orderDetailsSection}>
              <h3>Información del Cliente</h3>
              <p><strong>Nombre:</strong> {selectedOrder.customer_name}</p>
              <p><strong>Teléfono:</strong> {selectedOrder.customer_phone}</p>
              {selectedOrder.pickup ? (
                <p className={styles.pickupBadge}>Retirar en Barra</p>
              ) : (
                <p><strong>Mesa:</strong> {selectedOrder.table_number || 'No especificada'}</p>
              )}
            </div>
            
            <div className={styles.orderDetailsSection}>
              <h3>Información del Pago</h3>
              <p><strong>Estado:</strong> <span className={styles.paymentStatus}>{selectedOrder.payment_status}</span></p>
              <p><strong>Método:</strong> {selectedOrder.payment_method}</p>
              <p><strong>Total:</strong> ${selectedOrder.total_amount}</p>
            </div>
            
            <div className={styles.orderDetailsSection}>
              <h3>Productos</h3>
              <div className={styles.orderItemsList}>
                {Array.isArray(selectedOrder.items) ? 
                  selectedOrder.items.map((item, index) => (
                    <div key={index} className={styles.orderItem}>
                      <div className={styles.orderItemName}>
                        <span>{item.nombre || item.title || 'Producto'}</span>
                        <span className={styles.orderItemQuantity}>x{item.quantity || 1}</span>
                      </div>
                      <span className={styles.orderItemPrice}>${item.precio || item.unit_price || 0}</span>
                    </div>
                  )) : (
                    <p>No hay detalles de productos disponibles</p>
                  )
                }
              </div>
            </div>
            
            <div className={styles.orderActionsFooter}>
              <p>
                <strong>Fecha del pedido:</strong> {' '}
                {format(new Date(selectedOrder.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
              </p>
              
              <div className={styles.actionsContainer}>
                {!selectedOrder.delivered && (
                  <button 
                    className={styles.deliverButton}
                    onClick={() => {
                      markAsDelivered(selectedOrder.id);
                    }}
                  >
                    <FaCheck /> Marcar como Entregado
                  </button>
                )}
                
                <button 
                  className={styles.deleteButton}
                  onClick={() => {
                    deleteOrder(selectedOrder.id);
                  }}
                >
                  <FaTrash /> Eliminar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Pedidos</h1>
      
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por # orden, cliente o mesa..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <FaFilter className={styles.filterIcon} />
            <select
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Todos los pedidos</option>
              <option value="delivered">Entregados</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            {sortDirection === 'desc' ? (
              <FaSortAmountDown className={styles.sortIcon} />
            ) : (
              <FaSortAmountUp className={styles.sortIcon} />
            )}
            <select
              className={styles.filterSelect}
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="created_at">Fecha</option>
              <option value="total_amount">Monto</option>
              <option value="order_id">Número de orden</option>
              <option value="customer_name">Nombre del cliente</option>
            </select>
            <button
              className={styles.sortDirectionButton}
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            >
              {sortDirection === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando pedidos...</p>
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.noOrdersMessage}>
          <p>No se encontraron pedidos.</p>
        </div>
      ) : (
        <>
          <div className={styles.ordersTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Orden #</div>
              <div className={styles.headerCell}>Cliente</div>
              <div className={styles.headerCell}>Metodo Pago</div>
              <div className={styles.headerCell}>Fecha</div>
              <div className={styles.headerCell}>Mesa/Pickup</div>
              <div className={styles.headerCell}>Total</div>
              <div className={styles.headerCell}>Estado</div>
              <div className={styles.headerCell}>Acciones</div>
            </div>
            
            <div className={styles.tableBody}>
              {currentOrders.map(order => (
                <div key={order.id} className={`${styles.tableRow} ${order.delivered ? styles.deliveredRow : ''}`}>
                  <div className={styles.cell}>{order.order_id}</div>
                  <div className={styles.cell}>{order.customer_name}</div>
                  <div className={styles.cell}>{order.payment_method}</div>
                  <div className={styles.cell}>
                    {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </div>
                  <div className={styles.cell}>
                    {order.pickup ? (
                      <span className={styles.pickupBadge}>Pickup</span>
                    ) : (
                      `Mesa ${order.table_number || 'N/A'}`
                    )}
                  </div>
                  <div className={styles.cell}>${order.total_amount}</div>
                  <div className={styles.cell}>
                    <span className={`${styles.statusBadge} ${order.delivered ? styles.deliveredBadge : styles.pendingBadge}`}>
                      {order.delivered ? 'Entregado' : 'Pendiente'}
                    </span>
                  </div>
                  <div className={styles.cell}>
                    <div className={styles.actionsContainer}>
                      <button
                        className={styles.viewButton}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <FaEye /> Ver
                      </button>
                      {!order.delivered && (
                        <button
                          className={styles.deliverButton}
                          onClick={() => markAsDelivered(order.id)}
                        >
                          <FaCheck /> Entregar
                        </button>
                      )}
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteOrder(order.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </button>
            <span className={styles.paginationInfo}>
              Página {currentPage} de {totalPages} ({filteredOrders.length} pedidos)
            </span>
            <button
              className={styles.paginationButton}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
      
      {selectedOrder && renderOrderDetails()}
    </div>
  );
}