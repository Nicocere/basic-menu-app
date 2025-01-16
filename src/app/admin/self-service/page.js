'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabaseClient';
import Swal from 'sweetalert2';
import styles from './selfService.module.css';

export default function SelfService() {
    const [tables, setTables] = useState([]);
    const [newTable, setNewTable] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchTables = async () => {
            const { data, error } = await supabase.from('tables').select('*');
            if (error) {
                console.error('Error fetching tables:', error);
            } else {
                setTables(data);
            }
        };

        fetchTables();
    }, [tables]);

    const handleActivateMercadoPago = () => {
        // Lógica para activar Mercado Pago
        Swal.fire('Mercado Pago', 'Mercado Pago ha sido activado.', 'success');
    };

    const handleAddTable = async () => {
        if (newTable.trim() === '') return;

        setIsLoading(true);
        const { data, error } = await supabase.from('tables').insert([{ name: newTable }]);
        if (error) {
            console.error('Error adding table:', error);
            Swal.fire('Error', 'Hubo un error al agregar la mesa.', 'error');
        } else {
            setTables([...tables, ...data]);
            setNewTable('');
            Swal.fire('Mesa Agregada', 'La mesa ha sido agregada exitosamente.', 'success');
        }
        setIsLoading(false);
    };

    const handleDeleteTable = async (tableId) => {
        setIsLoading(true);
        const { error } = await supabase.from('tables').delete().eq('id', tableId);
        if (error) {
            console.error('Error deleting table:', error);
            Swal.fire('Error', 'Hubo un error al eliminar la mesa.', 'error');
        } else {
            setTables(tables.filter(table => table.id !== tableId));
            Swal.fire('Mesa Eliminada', 'La mesa ha sido eliminada exitosamente.', 'success');
        }
        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Administración de Self Service</h1>

            <section className={styles.section}>
                <h2>Activar Mercado Pago</h2>
                <p className={styles.infoText}>
                    Haga clic en el botón de abajo para activar Mercado Pago. Esto permitirá a los clientes realizar pagos a través de la plataforma de Mercado Pago.
                </p>
                <button className={styles.button} onClick={handleActivateMercadoPago}>
                    Activar Mercado Pago
                </button>
            </section>

            <section className={styles.section}>
                <h2>Gestión de Mesas</h2>
                <p className={styles.infoText}>
                    Aquí puede agregar, eliminar y gestionar las mesas disponibles en su local. Los clientes seleccionarán una mesa para realizar sus pedidos y pagos.
                </p>
                <div className={styles.tableManagement}>
                    <input
                        type="text"
                        value={newTable}
                        onChange={(e) => setNewTable(e.target.value)}
                        placeholder="Nombre de la nueva mesa"
                        className={styles.input}
                    />
                    <button className={styles.button} onClick={handleAddTable} disabled={isLoading}>
                        {isLoading ? 'Agregando...' : 'Agregar Mesa'}
                    </button>
                </div>

                <div className={styles.tableList}>
                    <h3>Mesas Disponibles</h3>
                    <p className={styles.infoText}>
                        A continuación se muestra la lista de mesas disponibles. Puede eliminar una mesa haciendo clic en el botón "Eliminar" junto a cada mesa.
                    </p>
                    <ul className={styles.list}>
                        {tables.map((table, idx) => (
                            <li key={idx} className={styles.listItem}>
                                {table?.name}
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteTable(table?.id)}
                                    disabled={isLoading}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}