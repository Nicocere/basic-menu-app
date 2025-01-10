import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1>Carta de Menú</h1>
            <nav>
                <ul>
                    <li><a href="/client">Cliente</a></li>
                    <li><a href="/admin">Administrador</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;