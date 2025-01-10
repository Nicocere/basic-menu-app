import React from 'react';
import Link from 'next/link';
import styles from '../../styles/components/Layout/Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h1>Bar Menu</h1>
            </div>
            <nav className={styles.navigation}>
                <ul>
                    <li>
                        <Link href="/">Inicio</Link>
                    </li>
                    <li>
                        <Link href="/menu">Menú</Link>
                    </li>
                    <li>
                        <Link href="/order">Pedido</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contacto</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;