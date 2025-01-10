import React, { useState } from 'react';
import styles from '../../../styles/components/Admin/EditMenu.module.css';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

const EditMenu = () => {
    const [menuItems, setMenuItems] = useState([
        { id: 1, name: 'Cerveza', price: 3.00 },
        { id: 2, name: 'Vino', price: 5.00 },
        { id: 3, name: 'Cocktail', price: 7.00 },
    ]);

    const [newItem, setNewItem] = useState({ name: '', price: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddItem = () => {
        if (newItem.name && newItem.price) {
            setMenuItems([...menuItems, { id: menuItems.length + 1, ...newItem }]);
            setNewItem({ name: '', price: '' });
        }
    };

    const handleDeleteItem = (id) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    return (
        <div className={styles.editMenu}>
            <h2>Editar Menú</h2>
            <div className={styles.menuList}>
                {menuItems.map(item => (
                    <div key={item.id} className={styles.menuItem}>
                        <span>{item.name} - ${item.price.toFixed(2)}</span>
                        <Button onClick={() => handleDeleteItem(item.id)}>Eliminar</Button>
                    </div>
                ))}
            </div>
            <div className={styles.addItem}>
                <Input
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    placeholder="Nombre del ítem"
                />
                <Input
                    name="price"
                    type="number"
                    value={newItem.price}
                    onChange={handleInputChange}
                    placeholder="Precio"
                />
                <Button onClick={handleAddItem}>Agregar Ítem</Button>
            </div>
        </div>
    );
};

export default EditMenu;