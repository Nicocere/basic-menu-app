import React from 'react';
import styles from './ManageOrders.module.css';

const ManageOrders: React.FC = () => {
    return (
        <div className={styles.manageOrders}>
            <h2>Gestionar Pedidos</h2>
            <p>Aquí puedes gestionar los pedidos de los clientes.</p>
        </div>
    );
};

export default ManageOrders;