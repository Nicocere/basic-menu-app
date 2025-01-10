import React from 'react';
import Link from 'next/link';
import styles from '../../styles/components/Layout/Sidebar.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <h2>Panel de Administración</h2>
            <ul>
                <li>
                    <Link href="/admin">Dashboard</Link>
                </li>
                <li>
                    <Link href="/admin/edit-menu">Editar Menú</Link>
                </li>
                <li>
                    <Link href="/admin/orders">Pedidos</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;