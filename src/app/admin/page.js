"use client";

import React from 'react';
import styles from './AdminHome.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCashRegister, FaTruck, FaStore, FaChartBar, FaBoxes, FaPrint, FaMoneyCheckAlt, FaUsers, FaConciergeBell, FaPaintBrush, FaBoxOpen, FaTags, FaClipboardList } from 'react-icons/fa';
import { QrCode2Outlined } from '@mui/icons-material';

const AdminHome = () => {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Panel de Administración</h1>
                <p className={styles.description}>Bienvenido al panel de control. Desde aquí podrás gestionar todos los aspectos de tu negocio.</p>
            </header>
            <main className={styles.main}>

                <motion.section className={styles.featuredSection} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaClipboardList /> Ver Órdenes</h2>
                    <p className={styles.description}>Consulta todas las órdenes recibidas, su estado actual y detalles completos para mantener un seguimiento efectivo de tus ventas.</p>
                    <Link href="/admin/ver-ordenes">
                        <button className={styles.button}>Órdenes</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaBoxOpen /> Agregar productos</h2>
                    <p className={styles.description}>Añade nuevos productos a tu menú. Completa información como nombre, descripción, precio, categoría e imagen para mantener tu carta actualizada.</p>
                    <Link href="/admin/agregar-productos">
                        <button className={styles.button}>Agregar productos</button>
                    </Link>
                </motion.section>

                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaTags /> Crear / Editar categorías y subcategorías</h2>
                    <p className={styles.description}>Organiza tu menú creando y modificando categorías y subcategorías. Una estructura clara facilita a tus clientes encontrar lo que buscan.</p>
                    <Link href="/admin/crear-editar-categorias">
                        <button className={styles.button}>Crear / Editar categorías y subcategorías</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaConciergeBell /> Servicios Autónomos para Clientes</h2>
                    <p className={styles.description}>Configura opciones de autoservicio para tus clientes, como pedidos desde la mesa o reservas online, mejorando su experiencia y optimizando tus operaciones.</p>
                    <Link href="/admin/self-service">
                        <button className={styles.button}>Servicios Autónomos</button>
                    </Link>
                </motion.section>

                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaPaintBrush /> Personalizar tu propio sitio</h2>
                    <p className={styles.description}>Próximamente podrás personalizar la apariencia de tu menú digital con colores, fuentes y diseños que reflejen la identidad de tu negocio.</p>
                    <Link href="/admin/personalizar-sitio">
                        <button className={styles.buttonDisabled} disabled>Proximamente...</button>
                    </Link>
                </motion.section>

                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><QrCode2Outlined /> Prueba de Lector QR</h2>
                    <p className={styles.description}>Prueba la funcionalidad del lector de códigos QR para escanear y procesar información. Verifica que la lectura de códigos funcione correctamente.</p>
                    <Link href="/admin/test-qrcode">
                        <button className={styles.button}>Testear QR </button>
                    </Link>
                </motion.section>
                {/* <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaTruck /> Integración con Apps de Delivery</h2>
                    <p className={styles.description}>Conecta tu negocio con plataformas de delivery populares para ampliar tu alcance y gestionar pedidos externos de manera eficiente.</p>
                    <Link href="/admin/delivery-integration">
                        <button className={styles.button}>Integración</button>
                    </Link>
                </motion.section> */}
                {/* <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaStore /> Tienda Online y Carta QR</h2>
                    <p className={styles.description}>Configura tu tienda online y genera códigos QR para que tus clientes accedan a tu carta digital desde sus dispositivos móviles.</p>
                    <Link href="/admin/online-store">
                        <button className={styles.button}>Tienda Online</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaChartBar /> Análisis de Reportes y Estadísticas</h2>
                    <p className={styles.description}>Accede a informes detallados sobre ventas, productos más populares y tendencias de consumo para tomar decisiones basadas en datos.</p>
                    <Link href="/admin/reports">
                        <button className={styles.button}>Reportes</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaBoxes /> Control de Stock Eficiente</h2>
                    <p className={styles.description}>Gestiona tu inventario, recibe alertas de stock bajo y optimiza tus compras para evitar pérdidas y maximizar ganancias.</p>
                    <Link href="/admin/stock-control">
                        <button className={styles.button}>Control de Stock</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaPrint /> Impresión de Comandas y Precuentas</h2>
                    <p className={styles.description}>Configura e imprime comandas para cocina y precuentas para clientes, agilizando el servicio y reduciendo errores en los pedidos.</p>
                    <Link href="/admin/printing">
                        <button className={styles.button}>Impresión</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaMoneyCheckAlt /> Registro de Gastos</h2>
                    <p className={styles.description}>Lleva un control detallado de todos los gastos de tu negocio, categorizándolos para analizar mejor la rentabilidad de tu operación.</p>
                    <Link href="/admin/expenses">
                        <button className={styles.button}>Registro de Gastos</button>
                    </Link>
                </motion.section>
                <motion.section className={styles.section} whileHover={{ scale: 1.05 }}>
                    <h2 className={styles.subtitle}><FaUsers /> Creación de Múltiples Usuarios y Roles</h2>
                    <p className={styles.description}>Crea cuentas para tu personal con diferentes niveles de acceso según sus responsabilidades, manteniendo la seguridad de tu sistema.</p>
                    <Link href="/admin/users">
                        <button className={styles.button}>Usuarios y Roles</button>
                    </Link>
                </motion.section> */}

            </main>
            <footer className={styles.footer}>
            </footer>
        </div>
    );
};

export default AdminHome;