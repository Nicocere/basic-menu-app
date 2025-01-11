"use client";

import React from 'react';
import styles from './AdminHome.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCashRegister, FaTruck, FaStore, FaChartBar, FaBoxes, FaPrint, FaMoneyCheckAlt, FaUsers, FaConciergeBell, FaPaintBrush, FaBoxOpen, FaTags } from 'react-icons/fa';

const AdminHome = () => {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Panel de Administración</h1>
            </header>
            <main className={styles.main}>

                    <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                <h2 className={styles.subtitle}><FaBoxOpen /> Agregar productos</h2>
                <Link href="/admin/agregar-productos">
                    <button className={styles.button}>Ir a Agregar productos</button>
                </Link>
            </motion.section>
            
            <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                <h2 className={styles.subtitle}><FaTags /> Crear / Editar categorías y subcategorías</h2>
                <Link href="/admin/crear-editar-categorias">
                    <button className={styles.button}>Ir a Crear / Editar categorías y subcategorías</button>
                </Link>
            </motion.section>
            <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaConciergeBell /> Servicios Autónomos para Clientes</h2>
                    <Link href="/admin/self-service">
                        <button className={styles.button}>Ir a Servicios Autónomos</button>
                    </Link>
                </motion.section> 

                        <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaPaintBrush /> Personalizar tu propio sitio</h2>
                    <Link href="/admin/personalizar-sitio">
                        <button className={styles.button}>Ir a Personalizar tu propio sitio</button>
                    </Link>
                </motion.section>

                {/* <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaCashRegister /> Arqueo de Caja Diario</h2>
                    <Link href="/admin/daily-cash">
                        <button className={styles.button}>Ir a Arqueo de Caja</button>
                    </Link>
                </motion.section> */}
                {/* <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaTruck /> Integración con Apps de Delivery</h2>
                    <Link href="/admin/delivery-integration">
                        <button className={styles.button}>Ir a Integración</button>
                    </Link>
                </motion.section> */}
                {/* <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaStore /> Tienda Online y Carta QR</h2>
                    <Link href="/admin/online-store">
                        <button className={styles.button}>Ir a Tienda Online</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaChartBar /> Análisis de Reportes y Estadísticas</h2>
                    <Link href="/admin/reports">
                        <button className={styles.button}>Ir a Reportes</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaBoxes /> Control de Stock Eficiente</h2>
                    <Link href="/admin/stock-control">
                        <button className={styles.button}>Ir a Control de Stock</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaPrint /> Impresión de Comandas y Precuentas</h2>
                    <Link href="/admin/printing">
                        <button className={styles.button}>Ir a Impresión</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaMoneyCheckAlt /> Registro de Gastos</h2>
                    <Link href="/admin/expenses">
                        <button className={styles.button}>Ir a Registro de Gastos</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaUsers /> Creación de Múltiples Usuarios y Roles</h2>
                    <Link href="/admin/users">
                        <button className={styles.button}>Ir a Usuarios y Roles</button>
                    </Link>
                </motion.section> */}
            
            </main>
            <footer className={styles.footer}>
                <p>© 2023 Bar Menu App</p>
            </footer>
        </div>
    );
};

export default AdminHome;