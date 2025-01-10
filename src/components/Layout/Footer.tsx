import React from 'react';
import styles from '../../../styles/Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>&copy; {new Date().getFullYear()} Bar Menu. Todos los derechos reservados.</p>
                <p>Contacto: info@barmenu.com</p>
            </div>
        </footer>
    );
};

export default Footer;