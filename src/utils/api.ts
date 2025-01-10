export const fetchMenu = async () => {
    const response = await fetch('/api/menu');
    if (!response.ok) {
        throw new Error('Error al obtener el menú');
    }
    return await response.json();
};

export const addMenuItem = async (menuItem) => {
    const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem),
    });
    if (!response.ok) {
        throw new Error('Error al agregar el elemento del menú');
    }
    return await response.json();
};

export const updateMenuItem = async (menuItem) => {
    const response = await fetch(`/api/menu/${menuItem.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el elemento del menú');
    }
    return await response.json();
};

export const deleteMenuItem = async (id) => {
    const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el elemento del menú');
    }
    return await response.json();
};