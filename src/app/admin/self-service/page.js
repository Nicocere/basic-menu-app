'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import Swal from 'sweetalert2';
import styles from './selfService.module.css';
import { FaUser, FaTable, FaCheck, FaTrash, FaPlusCircle, FaLink, FaUnlink } from 'react-icons/fa';

export default function SelfService() {
    // Estados para mesas
    const [tables, setTables] = useState([]);
    const [newTable, setNewTable] = useState('');

    // Estados para mozos
    const [waiters, setWaiters] = useState([]);
    const [newWaiter, setNewWaiter] = useState({ name: '', phone: '' });

    // Estado para asignaciones
    const [assignments, setAssignments] = useState([]);

    // Estado para la interfaz
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tables'); // 'tables', 'waiters', 'assignments'

    // Cargar datos al iniciar
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchTables(),
                fetchWaiters(),
                fetchAssignments()
            ]);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    // ===== FUNCIONES PARA MESAS =====
    const fetchTables = async () => {
        const { data, error } = await supabase
            .from('tables')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching tables:', error);
            showAlert('Error', 'No se pudieron cargar las mesas', 'error');
        } else {
            setTables(data || []);
        }
    };

    const handleAddTable = async () => {
        if (newTable.trim() === '') return;

        setIsLoading(true);
        const { data, error } = await supabase
            .from('tables')
            .insert([{ name: newTable.trim() }])
            .select();

        if (error) {
            console.error('Error adding table:', error);
            showAlert('Error', 'Hubo un error al agregar la mesa', 'error');
        } else {
            setTables([...tables, ...data]);
            setNewTable('');
            showAlert('Mesa Agregada', 'La mesa ha sido agregada exitosamente', 'success');
        }
        setIsLoading(false);
    };

    const handleDeleteTable = async (tableId) => {
        // Verificar si la mesa está asignada a algún mozo
        const assignedWaiters = assignments.filter(a => a.table_id === tableId);
        if (assignedWaiters.length > 0) {
            const result = await Swal.fire({
                title: 'Mesa Asignada',
                text: 'Esta mesa está asignada a uno o más mozos. ¿Desea eliminar la mesa y todas sus asignaciones?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#c8a25c',
                cancelButtonColor: '#9b4e33',
                background: '#1c1c24',
                color: '#ffffff'
            });

            if (!result.isConfirmed) return;
        }

        setIsLoading(true);

        // Primero eliminar las asignaciones relacionadas
        if (assignments.some(a => a.table_id === tableId)) {
            const { error: assignmentError } = await supabase
                .from('waiter_table_assignments')
                .delete()
                .eq('table_id', tableId);

            if (assignmentError) {
                console.error('Error removing table assignments:', assignmentError);
                showAlert('Error', 'No se pudieron eliminar las asignaciones de la mesa', 'error');
                setIsLoading(false);
                return;
            }

            // Actualizar las asignaciones en el estado
            setAssignments(assignments.filter(a => a.table_id !== tableId));
        }

        // Luego eliminar la mesa
        const { error } = await supabase
            .from('tables')
            .delete()
            .eq('id', tableId);

        if (error) {
            console.error('Error deleting table:', error);
            showAlert('Error', 'Hubo un error al eliminar la mesa', 'error');
        } else {
            setTables(tables.filter(table => table.id !== tableId));
            showAlert('Mesa Eliminada', 'La mesa ha sido eliminada exitosamente', 'success');
        }

        setIsLoading(false);
    };

    // ===== FUNCIONES PARA MOZOS =====
    const fetchWaiters = async () => {
        const { data, error } = await supabase
            .from('waiters')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching waiters:', error);
            showAlert('Error', 'No se pudieron cargar los mozos', 'error');
        } else {
            setWaiters(data || []);
        }
    };

    const handleAddWaiter = async () => {
        if (newWaiter.name.trim() === '') {
            showAlert('Error', 'El nombre del mozo no puede estar vacío', 'error');
            return;
        }

        setIsLoading(true);
        const { data, error } = await supabase
            .from('waiters')
            .insert([{
                name: newWaiter.name.trim(),
                phone: newWaiter.phone.trim() || null
            }])
            .select();

        if (error) {
            console.error('Error adding waiter:', error);
            showAlert('Error', 'Hubo un error al agregar el mozo', 'error');
        } else {
            setWaiters([...waiters, ...data]);
            setNewWaiter({ name: '', phone: '' });
            showAlert('Mozo Agregado', 'El mozo ha sido agregado exitosamente', 'success');
        }
        setIsLoading(false);
    };

    const handleDeleteWaiter = async (waiterId) => {
        // Verificar si el mozo tiene mesas asignadas
        const waiterAssignments = assignments.filter(a => a.waiter_id === waiterId);
        if (waiterAssignments.length > 0) {
            const result = await Swal.fire({
                title: 'Mozo con Mesas Asignadas',
                text: 'Este mozo tiene mesas asignadas. ¿Desea eliminar el mozo y todas sus asignaciones?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#c8a25c',
                cancelButtonColor: '#9b4e33',
                background: '#1c1c24',
                color: '#ffffff'
            });

            if (!result.isConfirmed) return;
        }

        setIsLoading(true);

        // Primero eliminar las asignaciones relacionadas
        if (assignments.some(a => a.waiter_id === waiterId)) {
            const { error: assignmentError } = await supabase
                .from('waiter_table_assignments')
                .delete()
                .eq('waiter_id', waiterId);

            if (assignmentError) {
                console.error('Error removing waiter assignments:', assignmentError);
                showAlert('Error', 'No se pudieron eliminar las asignaciones del mozo', 'error');
                setIsLoading(false);
                return;
            }

            // Actualizar las asignaciones en el estado
            setAssignments(assignments.filter(a => a.waiter_id !== waiterId));
        }

        // Luego eliminar el mozo
        const { error } = await supabase
            .from('waiters')
            .delete()
            .eq('id', waiterId);

        if (error) {
            console.error('Error deleting waiter:', error);
            showAlert('Error', 'Hubo un error al eliminar el mozo', 'error');
        } else {
            setWaiters(waiters.filter(waiter => waiter.id !== waiterId));
            showAlert('Mozo Eliminado', 'El mozo ha sido eliminado exitosamente', 'success');
        }

        setIsLoading(false);
    };

    // ===== FUNCIONES PARA ASIGNACIONES =====
    const fetchAssignments = async () => {
        try {
            // Primero verificamos si la tabla existe con una consulta más simple
            const { data: checkData, error: checkError } = await supabase
                .from('waiter_table_assignments')
                .select('id, waiter_id, table_id')
                .limit(1);

            if (checkError) {
                console.error('Error checking assignments table:', checkError);
                showAlert('Error', 'La tabla de asignaciones no existe o no está accesible', 'error');
                setAssignments([]);
                return;
            }

            // Si llegamos aquí, la tabla existe, intentamos obtener los datos con joins
            const { data, error } = await supabase
                .from('waiter_table_assignments')
                .select('id, waiter_id, table_id');

            if (error) {
                console.error('Error fetching assignments:', error);
                showAlert('Error', 'No se pudieron cargar las asignaciones', 'error');
                setAssignments([]);
            } else {
                // Procesar manualmente los datos para obtener la información de mozos y mesas
                const processedAssignments = await Promise.all(data.map(async (assignment) => {
                    // Obtener información del mozo
                    const { data: waiterData } = await supabase
                        .from('waiters')
                        .select('name')
                        .eq('id', assignment.waiter_id)
                        .single();

                    // Obtener información de la mesa
                    const { data: tableData } = await supabase
                        .from('tables')
                        .select('name')
                        .eq('id', assignment.table_id)
                        .single();

                    return {
                        ...assignment,
                        waiters: waiterData,
                        tables: tableData
                    };
                }));


                setAssignments(processedAssignments || []);
            }
        } catch (error) {
            console.error('Unexpected error in fetchAssignments:', error);
            showAlert('Error', 'Ocurrió un error inesperado al cargar las asignaciones', 'error');
            setAssignments([]);
        }
    };

    const handleAssignTable = async (waiterName, tableName) => {
        // Verificar que los IDs sean válidos
        if (!waiterName || !tableName) {
            showAlert('Error', 'Seleccione un mozo y una mesa válidos', 'error');
            return;
        }

        // Verificar si ya existe la asignación
        if (assignments.some(a => a.waiter_id === waiterName && a.table_id === tableName)) {
            showAlert('Asignación existente',
                `El mozo "${waiterName}" ya está asignado a la mesa "${tableName}"`, 'info');
            return;
        }

        setIsLoading(true);
        try {
            // Intentar la inserción
            const { data, error } = await supabase
                .from('waiter_table_assignments')
                .insert([{
                    waiter_id: waiterName,
                    table_id: tableName
                }])
                .select('id, waiter_id, table_id');

            if (error) {
                console.error('Error assigning table:', error);
                showAlert('Error', `Hubo un error al asignar el mozo "${waiterName}" a la mesa "${tableName}"`, 'error');
            } else if (data) {
                // Enriquecer los datos con nombres
                const enrichedData = data.map(item => ({
                    ...item,
                    waiters: { name: waiterName },
                    tables: { name: tableName }
                }));

                setAssignments([...assignments, ...enrichedData]);
                showAlert('Asignación Exitosa',
                    `El mozo "${waiterName}" ha sido asignado a la mesa "${tableName}"`, 'success');

                // Refrescar las asignaciones para asegurar consistencia
                await fetchAssignments();
            }
        } catch (err) {
            console.error('Unexpected error in handleAssignTable:', err);
            showAlert('Error', 'Hubo un error inesperado al intentar realizar la asignación', 'error');
        } finally {
            setIsLoading(false);
        }
    };


    const handleUnassignTable = async (assignmentId) => {
        // Obtener la información de la asignación para mostrar mensajes amigables
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) {
            showAlert('Error', 'No se encontró la asignación', 'error');
            return;
        }

        const waiter = waiters.find(w => w.id === assignment.waiter_id);
        const table = tables.find(t => t.id === assignment.table_id);

        const waiterName = waiter?.name || 'Mozo desconocido';
        const tableName = table?.name || 'Mesa desconocida';

        setIsLoading(true);
        const { error } = await supabase
            .from('waiter_table_assignments')
            .delete()
            .eq('id', assignmentId);

        if (error) {
            console.error('Error unassigning table:', error);
            showAlert('Error', `Hubo un error al desasignar el mozo "${waiterName}" de la mesa "${tableName}"`, 'error');
        } else {
            setAssignments(assignments.filter(a => a.id !== assignmentId));
            showAlert('Desasignación Exitosa',
                `El mozo "${waiterName}" ha sido desasignado de la mesa "${tableName}"`, 'success');
        }
        setIsLoading(false);
    };

    // ===== UTILIDADES =====
    const showAlert = (title, text, icon) => {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: '#c8a25c',
            background: '#1c1c24',
            color: '#ffffff'
        });
    };

    const handleActivateMercadoPago = () => {
        // Lógica para activar Mercado Pago
        showAlert('Mercado Pago', 'Mercado Pago ha sido activado', 'success');
    };

    const getAssignedTablesForWaiter = (waiterId) => {
        return assignments
            .filter(a => a.waiter_id === waiterId)
            .map(a => {
                const table = tables.find(t => t.id === a.table_id);
                return {
                    assignmentId: a.id,
                    tableId: a.table_id,
                    tableName: table ? table.name : 'Mesa desconocida'
                };
            });
    };

    const getAssignedWaiterForTable = (tableId) => {
        const assignment = assignments.find(a => a.table_id === tableId);
        if (!assignment) return null;

        const waiter = waiters.find(w => w.id === assignment.waiter_id);
        return waiter ? {
            waiterId: waiter.id,
            waiterName: waiter.name,
            assignmentId: assignment.id
        } : null;
    };

    // ===== RENDERIZADO DE LA UI =====
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Administración de Servicio</h1>
            {/* Panel de Mercado Pago (siempre visible) */}
            <section className={styles.section}>
                <h2>Activar Mercado Pago</h2>
                <p className={styles.infoText}>
                    Haga clic en el botón de abajo para activar Mercado Pago. Esto permitirá a los clientes realizar pagos a través de la plataforma de Mercado Pago.
                </p>
                <button className={styles.button} onClick={handleActivateMercadoPago}>
                    Activar Mercado Pago
                </button>
            </section>


            {/* Navegación por pestañas */}
            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'tables' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('tables')}
                >
                    <FaTable /> Mesas
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'waiters' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('waiters')}
                >
                    <FaUser /> Mozos
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'assignments' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('assignments')}
                >
                    <FaLink /> Asignaciones
                </button>
            </div>


            {/* Panel de Gestión de Mesas */}
            {activeTab === 'tables' && (
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
                        <button
                            className={styles.button}
                            onClick={handleAddTable}
                            disabled={isLoading || newTable.trim() === ''}
                        >
                            {isLoading ? 'Agregando...' : 'Agregar Mesa'}
                        </button>
                    </div>

                    <div className={styles.tableList}>
                        <h3>Mesas Disponibles</h3>
                        {tables.length === 0 ? (
                            <p className={styles.emptyState}>No hay mesas disponibles. Agregue una nueva mesa.</p>
                        ) : (
                            <ul className={styles.list}>
                                {tables.map((table) => {
                                    const assignedWaiter = getAssignedWaiterForTable(table.id);

                                    return (
                                        <li key={table.id} className={styles.listItem}>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemName}>{table.name}</span>
                                                {assignedWaiter && (
                                                    <span className={styles.assignmentBadge}>
                                                        Mozo: {assignedWaiter.waiterName}
                                                    </span>
                                                )}
                                            </div>

                                            <div className={styles.itemActions}>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteTable(table.id)}
                                                    disabled={isLoading}
                                                >
                                                    <FaTrash /> Eliminar
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>
            )}

            {/* Panel de Gestión de Mozos */}
            {activeTab === 'waiters' && (
                <section className={styles.section}>
                    <h2>Gestión de Mozos</h2>
                    <p className={styles.infoText}>
                        Agregue y administre los mozos que atenderán las mesas de su local. Podrá asignar mesas específicas a cada mozo.
                    </p>

                    <div className={styles.waiterManagement}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                value={newWaiter.name}
                                onChange={(e) => setNewWaiter({ ...newWaiter, name: e.target.value })}
                                placeholder="Nombre del mozo"
                                className={styles.input}
                            />

                            <input
                                type="tel"
                                value={newWaiter.phone}
                                onChange={(e) => setNewWaiter({ ...newWaiter, phone: e.target.value })}
                                placeholder="Teléfono (opcional)"
                                className={styles.input}
                            />

                            <button
                                className={styles.button}
                                onClick={handleAddWaiter}
                                disabled={isLoading || newWaiter.name.trim() === ''}
                            >
                                {isLoading ? 'Agregando...' : 'Agregar Mozo'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.waiterList}>
                        <h3>Mozos Registrados</h3>
                        {waiters.length === 0 ? (
                            <p className={styles.emptyState}>No hay mozos registrados. Agregue un nuevo mozo.</p>
                        ) : (
                            <ul className={styles.list}>
                                {waiters.map((waiter) => {
                                    const assignedTables = getAssignedTablesForWaiter(waiter.id);

                                    return (
                                        <li key={waiter.id} className={styles.listItem}>
                                            <div className={styles.itemInfo}>
                                                <div>
                                                    <span className={styles.itemName}>{waiter.name}</span>
                                                    {waiter.phone && (
                                                        <span className={styles.itemDetail}>Tel: {waiter.phone}</span>
                                                    )}
                                                </div>

                                                {assignedTables.length > 0 && (
                                                    <div className={styles.assignmentsList}>
                                                        <span className={styles.assignmentsLabel}>Mesas asignadas:</span>
                                                        <div className={styles.assignmentBadges}>
                                                            {assignedTables.map(table => (
                                                                <span key={table.assignmentId} className={styles.tableBadge}>
                                                                    {table.tableName}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles.itemActions}>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteWaiter(waiter.id)}
                                                    disabled={isLoading}
                                                >
                                                    <FaTrash /> Eliminar
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>
            )}

            {/* Panel de Asignaciones de Mesas a Mozos */}
            {activeTab === 'assignments' && (
                <section className={styles.section}>
                    <h2>Asignación de Mesas a Mozos</h2>
                    <p className={styles.infoText}>
                        Asigne mesas específicas a cada mozo para organizar la atención al cliente. Una mesa solo puede ser asignada a un mozo a la vez.
                    </p>

                    {waiters.length === 0 || tables.length === 0 ? (
                        <div className={styles.alertBox}>
                            {waiters.length === 0 && tables.length === 0 && (
                                <p>Para hacer asignaciones, primero debe agregar mesas y mozos.</p>
                            )}
                            {waiters.length === 0 && tables.length > 0 && (
                                <p>Para hacer asignaciones, primero debe agregar mozos.</p>
                            )}
                            {waiters.length > 0 && tables.length === 0 && (
                                <p>Para hacer asignaciones, primero debe agregar mesas.</p>
                            )}
                        </div>
                    ) : (
                        <>

                            <div className={styles.assignmentCreator}>
                                <h3>Crear nueva asignación</h3>
                                <div className={styles.assignmentForm}>
                                    <select className={styles.select} id="waiterSelect">
                                        <option value="">Seleccionar Mozo</option>
                                        {waiters.map((waiter, idx) => (
                                            <option key={waiter.id} value={waiter.id}>
                                                {waiter.name}
                                            </option>
                                        ))}
                                    </select>

                                    <select className={styles.select} id="tableSelect">
                                        <option value="">Seleccionar Mesa</option>
                                        {tables
                                            .filter(table => !assignments.some(a => a.table_id === table.id))
                                            .map(table => (
                                                <option key={table.id} value={table.id}>
                                                    {table.name}
                                                </option>
                                            ))}
                                    </select>

                                    <button
                                        className={styles.button}
                                        onClick={() => {
                                            const waiterSelect = document.getElementById('waiterSelect');
                                            const tableSelect = document.getElementById('tableSelect');

                                            if (!waiterSelect || !tableSelect ||
                                                !waiterSelect.value || !tableSelect.value) {
                                                showAlert('Error', 'Seleccione un mozo y una mesa', 'error');
                                                return;
                                            }

                                            // Obtener los nombres para mostrar mensajes más amigables
                                            const selectedWaiter = waiters.find(w => w.id === Number(waiterSelect.value));
                                            const selectedTable = tables.find(t => t.id === tableSelect.value);

                                            if (!selectedWaiter || !selectedTable) {
                                                showAlert('Error', 'No se pudieron encontrar los datos del mozo o la mesa', 'error');
                                                return;
                                            }

                                            const waiterName = selectedWaiter.name;
                                            const tableName = selectedTable.name;

                                            // Confirmar la asignación
                                            Swal.fire({
                                                title: 'Confirmar asignación',
                                                text: `¿Desea asignar al mozo "${waiterName}" a la mesa "${tableName}"?`,
                                                icon: 'question',
                                                showCancelButton: true,
                                                confirmButtonText: 'Sí, asignar',
                                                cancelButtonText: 'Cancelar',
                                                confirmButtonColor: '#c8a25c',
                                                cancelButtonColor: '#9b4e33',
                                                background: '#1c1c24',
                                                color: '#ffffff'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleAssignTable(selectedWaiter.name, selectedTable.name);
                                                }
                                            });
                                        }}
                                    >
                                        <FaLink /> Asignar
                                    </button>
                                </div>
                            </div>

                            <div className={styles.assignmentsList}>
                                <h3>Asignaciones Actuales</h3>
                                {assignments.length === 0 ? (
                                    <p className={styles.emptyState}>No hay asignaciones. Cree una nueva asignación.</p>
                                ) : (
                                    <ul className={styles.list}>
                                        {waiters.map(waiter => {
                                            // Usar el ID correcto para filtrar las asignaciones por mozo
                                            const waiterAssignments = assignments.filter(a => a.waiter_id === waiter.name);

                                            if (waiterAssignments.length === 0) return null;

                                            return (
                                                <li key={waiter.id} className={styles.assignmentGroup}>
                                                    <div className={styles.assignmentGroupHeader}>
                                                        <h4>{waiter.name}</h4>
                                                        <span className={styles.assignmentCount}>
                                                            {waiterAssignments.length} mesa(s)
                                                        </span>
                                                    </div>

                                                    <ul className={styles.assignmentSublist}>
                                                        {waiterAssignments.map(assignment => {
                                                            const table = tables.find(t => t.name === assignment.table_id);

                                                            if (!table) return null;

                                                            return (
                                                                <li key={assignment.id} className={styles.assignmentItem}>
                                                                    <span className={styles.tableName}>
                                                                        <FaTable /> {table.name}
                                                                    </span>

                                                                    <button
                                                                        className={styles.unlinkButton}
                                                                        onClick={() => {
                                                                            Swal.fire({
                                                                                title: 'Confirmar desasignación',
                                                                                text: `¿Desea quitar al mozo "${waiter.name}" de la mesa "${table.name}"?`,
                                                                                icon: 'warning',
                                                                                showCancelButton: true,
                                                                                confirmButtonText: 'Sí, desasignar',
                                                                                cancelButtonText: 'Cancelar',
                                                                                confirmButtonColor: '#c8a25c',
                                                                                cancelButtonColor: '#9b4e33',
                                                                                background: '#1c1c24',
                                                                                color: '#ffffff'
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    handleUnassignTable(assignment.id);
                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        <FaUnlink /> Desasignar
                                                                    </button>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </section>
            )}
        </div>
    );
}