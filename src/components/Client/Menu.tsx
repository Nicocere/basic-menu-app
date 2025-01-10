import React from 'react';
import styles from '../../styles/components/Client/Menu.module.css';

const Menu = () => {
    const menuItems = [
        { id: 1, name: 'Cerveza', price: 3.00 },
        { id: 2, name: 'Vino', price: 5.00 },
        { id: 3, name: 'Cóctel', price: 7.00 },
        { id: 4, name: 'Refresco', price: 2.00 },
    ];

    return (
        <div className={styles.menuContainer}>
            <h1>Menú del Bar</h1>
            <ul className={styles.menuList}>
                {menuItems.map(item => (
                    <li key={item.id} className={styles.menuItem}>
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Menu;