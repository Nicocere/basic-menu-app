import React from 'react';
import styles from '../../../styles/components/Admin/Dashboard.module.css';

const Dashboard: React.FC = () => {
    return (
        <div className={styles.dashboard}>
            <h1>Panel de Control del Administrador</h1>
            <div className={styles.stats}>
                <h2>Estadísticas</h2>
                <p>Total de Pedidos: 150</p>
                <p>Total de Clientes: 75</p>
                <p>Ingresos Totales: $2000</p>
            </div>
            <div className={styles.menuManagement}>
                <h2>Gestión del Menú</h2>
                <button className={styles.editMenuButton}>Editar Menú</button>
            </div>
            <div className={styles.orderManagement}>
                <h2>Gestión de Pedidos</h2>
                <button className={styles.viewOrdersButton}>Ver Pedidos</button>
            </div>
        </div>
    );
};

export default Dashboard;